use coreum_wasm_sdk::core::{CoreumMsg, CoreumQueries};
use cosmwasm_std::{
    coin, entry_point, to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError,
    StdResult, Storage, Uint64,
};
use std::collections::LinkedList;

use crate::coin_helpers::assert_sent_sufficient_coin;
use crate::error::ContractError;
use crate::msg::{ExecuteMsg, GetDIDResponse, GetMerkleRootResponse, InstantiateMsg, QueryMsg};
use crate::state::{
    config_storage, config_storage_read, did_storage, did_storage_read, profile_storage,
    username_storage, username_storage_read, vc_storage, vc_storage_read, wallet_storage,
    wallet_storage_read, Config, DidInfo, ProfileInfo,
};
use crate::subscription::{
    get_subscription_duration, get_subscription_info, get_subscription_price, is_subscriber,
    set_subscription, subscribe,
};
use cosmwasm_storage::ReadonlyBucket;

use crate::merkle_tree::MerkleTree;

const MIN_NAME_LENGTH: u64 = 3;
const MAX_NAME_LENGTH: u64 = 64;

// TODO: adjust this to "utestcore" when deploying the contract, so it works when deployed to testnet
pub const FEE_DENOM: &str = "ucore";

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
        subscription_fee: msg.subscription_fee
    };

    config_storage(deps.storage).save(&config_state)?;

    Ok(Response::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut<CoreumQueries>,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response<CoreumMsg>, ContractError> {
    match msg {
        ExecuteMsg::Register { did, username } => execute_register(deps, env, info, username, did),
        ExecuteMsg::RemoveDID { did, username } => execute_remove(deps, env, info, username, did),
        ExecuteMsg::UpdateCredentialMerkleRoot { did, root } => {
            execute_update_vc_root(deps, env, info, did, root)
        }
        ExecuteMsg::SetSubscription { price, duration } => {
            set_subscription(deps, info, price, duration)
        }
        ExecuteMsg::Subscribe { did } => subscribe(deps, env, info, did),
    }
}

pub fn execute_register(
    deps: DepsMut<CoreumQueries>,
    _env: Env,
    info: MessageInfo,
    username: String,
    did: String,
) -> Result<Response<CoreumMsg>, ContractError> {
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
        did: did.clone(),
    };

    // store for querying in all three buckets
    did_storage(deps.storage).save(record.did.as_bytes(), &record)?;
    username_storage(deps.storage).save(record.username.as_bytes(), &record)?;
    wallet_storage(deps.storage).save(record.wallet.as_bytes(), &record)?;

    let user_profile = ProfileInfo {
        subscription_price: Some(coin(0, FEE_DENOM)), // TODO - get from env / use native coin?
        subscription_duration_days: Some(Uint64::from(7u64)),
        top_subscribers: LinkedList::new(),
        subscriber_count: Uint64::zero(),
    };
    if profile_storage(deps.storage)
        .save(record.did.as_bytes(), &user_profile)
        .is_err()
    {
        return Err(ContractError::ProfileSaveFailed { did: did });
    }

    // // create an NFT class for this DID
    // // so all of the subscription to this user is an NFT of this class
    // let clipped_did_length = min(26, record.did.len());
    // let symbol = record.did.to_string()[record.did.len() - clipped_did_length..].to_string(); // TODO: Coreum regex workaround
    // let issue_class_msg = CoreumMsg::AssetNFT(assetnft::Msg::IssueClass {
    //     name: record.did.to_string(), // class = user's DID they just registered
    //     symbol,                       // class = cropped DID
    //     description: Some(
    //         format!("Subscribers of {} (DID: {})", record.username, record.did).to_string(),
    //     ),
    //     uri: None,
    //     uri_hash: None,
    //     data: None,                            //
    //     features: Some(vec![DISABLE_SENDING]), // subscription NFTs are soul-bound tokens (SBTs)
    //     royalty_rate: Some("0".to_string()), // built-in royalties disabled for now, revenue model is externally managed
    // });

    Ok(Response::default())
    // .add_message(issue_class_msg))
}

pub fn execute_remove(
    deps: DepsMut<CoreumQueries>,
    _env: Env,
    info: MessageInfo,
    username: String,
    _did: String,
) -> Result<Response<CoreumMsg>, ContractError> {
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

    // Remove from all three buckets
    did_storage(deps.storage).remove(record.did.as_bytes());
    username_storage(deps.storage).remove(record.username.as_bytes());
    wallet_storage(deps.storage).remove(record.wallet.as_bytes());

    Ok(Response::<CoreumMsg>::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps<CoreumQueries>, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Config {} => to_json_binary(&config_storage_read(deps.storage).load()?),

        QueryMsg::GetWalletDID { wallet } => query_resolver(deps, env, wallet, wallet_storage_read),
        QueryMsg::GetUsernameDID { username } => {
            query_resolver(deps, env, username, username_storage_read)
        }
        QueryMsg::GetDID { did } => query_resolver(deps, env, did, did_storage_read),
        QueryMsg::GetMerkleRoot { did } => query_merkle_root(deps, env, did),
        QueryMsg::VerifyCredential {
            did,
            credential_hash,
            merkle_proofs,
        } => query_verify_credential(deps, env, did, credential_hash, merkle_proofs),
        QueryMsg::IsSubscriber { did, subscriber } => is_subscriber(deps, env, did, subscriber),
        QueryMsg::GetSubscriptionPrice { did } => get_subscription_price(deps, did),
        QueryMsg::GetSubscriptionDuration { did } => get_subscription_duration(deps, did),
        QueryMsg::GetSubscriptionInfo { did, subscriber } => {
            get_subscription_info(deps, env, did, subscriber)
        }
    }
}

type ResolverFnPointer = fn(&dyn Storage) -> ReadonlyBucket<DidInfo>;
fn query_resolver(
    deps: Deps<CoreumQueries>,
    _env: Env,
    query_key: String,
    storage_resolver: ResolverFnPointer,
) -> StdResult<Binary> {
    let key = query_key.as_bytes();

    // read the DID from an appropriate storage bucket
    let did_info = match storage_resolver(deps.storage).may_load(key) {
        Ok(info) => info,
        Err(_) => None,
    };

    let did_response: GetDIDResponse = GetDIDResponse { did_info: did_info };

    to_json_binary(&did_response)
}

fn query_merkle_root(deps: Deps<CoreumQueries>, _env: Env, did: String) -> StdResult<Binary> {
    let stored_root = vc_storage_read(deps.storage).may_load(did.as_bytes())?;

    if stored_root.is_none() {
        return Err(StdError::not_found("Merkle root"));
    }

    let merkle_root_response: GetMerkleRootResponse = GetMerkleRootResponse { root: stored_root };

    Ok(to_json_binary(&merkle_root_response)?)
}

fn query_verify_credential(
    deps: Deps<CoreumQueries>,
    _env: Env,
    did: String,
    credential_hash: String,
    merkle_proofs: LinkedList<String>,
) -> StdResult<Binary> {
    let stored_root = vc_storage_read(deps.storage).may_load(did.as_bytes())?;

    if stored_root.is_none() {
        return Err(StdError::not_found("Merkle root"));
    }

    let proof_slices: Vec<String> = merkle_proofs.iter().map(|x| x.to_string()).collect();
    let verification_result =
        MerkleTree::verify_proof_for_root(&stored_root.unwrap(), &credential_hash, proof_slices);

    Ok(to_json_binary(&verification_result)?)
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
    deps: DepsMut<CoreumQueries>,
    _env: Env,
    _info: MessageInfo,
    did: String,
    root: String,
) -> Result<Response<CoreumMsg>, ContractError> {
    // let config_state = config_storage(deps.storage).load()?;
    // assert_sent_sufficient_coin(&info.funds, config_state.did_register_price)?;

    let key = did.as_bytes();
    let did_record = did_storage_read(deps.storage).may_load(key)?;
    if did_record.is_none() {
        return Err(ContractError::NameNotExists { name: did });
    }

    // only account owner can update their VCs root
    let record = did_record.unwrap();
    if _info.sender != record.wallet {
        return Err(ContractError::Unauthorized {});
    }

    vc_storage(deps.storage).save(key, &root)?;

    Ok(Response::<CoreumMsg>::default())
}
