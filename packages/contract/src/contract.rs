use std::collections::LinkedList;
use sha2::{Sha256, Digest}; // Importing cryptographic hash functions
use hex;

use coreum_wasm_sdk::types::cosmos::group::v1::Exec;
use cosmwasm_std::{
    entry_point, to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult, Storage
};

use crate::coin_helpers::assert_sent_sufficient_coin;
use crate::error::ContractError;
use crate::msg::{ExecuteMsg, GetDIDResponse, InstantiateMsg, QueryMsg};
use crate::state::{
    config_storage,
    config_storage_read,
    username_storage,
    username_storage_read,
    did_storage,
    did_storage_read,
    wallet_storage,
    wallet_storage_read,
    vc_storage,
    vc_storage_read,
    Config, 
    DidInfo
};
use cosmwasm_storage::{ReadonlyBucket};

const MIN_NAME_LENGTH: u64 = 3;
const MAX_NAME_LENGTH: u64 = 64;

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, StdError> {
    let config_state = Config {
        owner: info.sender,
        did_register_price: msg.purchase_price,
    };

    config_storage(deps.storage).save(&config_state)?;

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Register { did, username } => execute_register(deps, env, info, username, did),
        ExecuteMsg::RemoveDID { did, username } => execute_remove(deps, env, info, username, did),
        ExecuteMsg::UpdateCredentialMerkeRoot { did, root } => execute_update_vc_root(deps, env, info, did, root)
    }
}

pub fn execute_register(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    username: String,
    did: String,
) -> Result<Response, ContractError> {
    
    validate_name(&username)?;

    // TODO: agree how much will new DID registration cost
    let config_state = config_storage(deps.storage).load()?;
    assert_sent_sufficient_coin(&info.funds, config_state.did_register_price)?;

    let key = username.as_bytes();
    if (username_storage_read(deps.storage).may_load(key)?).is_some() {
        // username is already taken
        return Err(ContractError::NameTaken { name: username });
    }

    // name is available
    let record = DidInfo {
        wallet: info.sender,
        username: username.clone(),
        did: did
    };

    // store for querying in all three buckets
    did_storage(deps.storage).save(record.did.as_bytes(), &record)?;
    username_storage(deps.storage).save(record.username.as_bytes(), &record)?;
    wallet_storage(deps.storage).save(record.wallet.as_bytes(), &record)?;

    Ok(Response::default())
}


pub fn execute_remove(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    username: String,
    did: String,
) -> Result<Response, ContractError> {

    // TODO: agree how much will new DID registration cost
    let config_state = config_storage(deps.storage).load()?;
    assert_sent_sufficient_coin(&info.funds, config_state.did_register_price)?;

    let key = username.as_bytes();
    let did_record = username_storage_read(deps.storage).may_load(key)?;
    if did_record.is_none() {
        // username does not exist
        return Err(ContractError::NameNotExists { name: username });
    }

    let record = did_record.unwrap();
    if record.wallet != info.sender {
        // Only the owner can remove their own DID
        return Err(ContractError::Unauthorized {});
    }

    // name is available
    let record = DidInfo {
        wallet: info.sender,
        username: username.clone(),
        did: did
    };

    // store for querying in all three buckets
    did_storage(deps.storage).remove(record.did.as_bytes());
    username_storage(deps.storage).remove(record.username.as_bytes());
    wallet_storage(deps.storage).remove(record.wallet.as_bytes());

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Config {} => to_binary(&config_storage_read(deps.storage).load()?),

        QueryMsg::GetWalletDID { wallet } => query_resolver(deps, env, wallet, wallet_storage_read),
        QueryMsg::GetUsernameDID { username } => query_resolver(deps, env, username, username_storage_read),
        QueryMsg::GetDID { did } => query_resolver(deps, env, did, did_storage_read),
        QueryMsg::VerifyCredential { did, credential_hash, merkle_proofs } => query_verify_credential(deps, env, did, credential_hash, merkle_proofs)
    }
}

type ResolverFnPointer = fn(&dyn Storage) -> ReadonlyBucket<DidInfo>;
fn query_resolver(deps: Deps, _env: Env, query_key: String, storage_resolver: ResolverFnPointer) -> StdResult<Binary> {
    let key = query_key.as_bytes();

    // read the DID from an appropriate storage bucket
    let did_info = match storage_resolver(deps.storage).may_load(key) {
        Ok(info) => info,
        Err(_) => None
    };

    let did_response: GetDIDResponse = GetDIDResponse {
        did_info: did_info
    };

    to_binary(&did_response)
}

fn query_verify_credential(deps: Deps, _env: Env, did: String, credential_hash: String, merkle_proofs: LinkedList<String>) -> StdResult<Binary> {
    let stored_root = vc_storage_read(deps.storage).may_load(did.as_bytes())?;
    
    if stored_root.is_none() {
        return Err(StdError::not_found("Merkle root"));
    }

    let mut current_hash = credential_hash;
    for proof in merkle_proofs {
        let mut hasher = Sha256::new();
        if proof < current_hash {
            hasher.update(proof.as_bytes());
            hasher.update(current_hash.as_bytes());
        } else {
            hasher.update(current_hash.as_bytes());
            hasher.update(proof.as_bytes());
        }
        current_hash = hex::encode(hasher.finalize());
    }

    if current_hash == stored_root.unwrap() {
        Ok(to_binary(&true)?)
    } else {
        Ok(to_binary(&false)?)
    }
}

// let's not import a regexp library and just do these checks by hand
fn invalid_char(c: char) -> bool {
    !c.is_alphanumeric()
}

/// validate_name returns an error if the name is invalid
/// (we require 3-64 lowercase ascii letters, numbers, or . - _)
fn validate_name(name: &str) -> Result<(), ContractError> {
    let length = name.len() as u64;
    if (name.len() as u64) < MIN_NAME_LENGTH {
        Err(ContractError::NameTooShort {
            length,
            min_length: MIN_NAME_LENGTH,
        })
    } else if (name.len() as u64) > MAX_NAME_LENGTH {
        Err(ContractError::NameTooLong {
            length,
            max_length: MAX_NAME_LENGTH,
        })
    } else {
        match name.find(invalid_char) {
            None => Ok(()),
            Some(bytepos_invalid_char_start) => {
                let c = name[bytepos_invalid_char_start..].chars().next().unwrap();
                Err(ContractError::InvalidCharacter { c })
            }
        }
    }
}

pub fn execute_update_vc_root(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    did: String,
    root: String
) -> Result<Response, ContractError> {
    
    let config_state = config_storage(deps.storage).load()?;
    assert_sent_sufficient_coin(&info.funds, config_state.did_register_price)?;

    let key = did.as_bytes();
    let did_record = did_storage_read(deps.storage).may_load(key)?;
    if did_record.is_none() {
        return Err(ContractError::NameNotExists { name: did });
    }

    let record = did_record.unwrap();
    if info.sender != record.wallet {
        return Err(ContractError::Unauthorized {});
    }

    vc_storage(deps.storage).save(key, &root)?;

    Ok(Response::default())
}

