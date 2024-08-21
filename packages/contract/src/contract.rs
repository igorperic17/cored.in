use coreum_wasm_sdk::assetnft::{self, DISABLE_SENDING};
use coreum_wasm_sdk::core::{CoreumMsg, CoreumQueries};
use cosmwasm_std::{
    coin, entry_point, from_json, to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult, Uint64
};
use cw_storage_plus::Map;
use std::collections::LinkedList;

use crate::coin_helpers::{assert_sent_sufficient_coin, generate_nft_class_id, generate_nft_symbol};
use crate::error::ContractError;
use crate::msg::{ExecuteMsg, GetDIDResponse, GetMerkleRootResponse, InstantiateMsg, QueryMsg};
use crate::state::{Config, ProfileInfo, CONFIG, CREDENTIAL, DID_PROFILE_MAP, USERNAME_PROFILE_MAP, WALLET_PROFILE_MAP};
use crate::subscription::{
    get_subscription_duration, get_subscription_info, get_subscription_price, is_subscriber,
    set_subscription, subscribe,
};

use crate::merkle_tree::MerkleTree;

const MIN_NAME_LENGTH: u64 = 3;
const MAX_NAME_LENGTH: u64 = 64;

// TODO: adjust this to "utestcore" when deploying the contract, so it works when deployed to testnet
pub const FEE_DENOM: &str = "ucore";

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response<CoreumMsg>, StdError> {
    let config_state = Config {
        owner: info.sender,
        did_register_price: msg.purchase_price,
        subscription_fee: msg.subscription_fee
    };
    CONFIG.save(deps.storage, &config_state)?;

    // create an NFT class for this DID
    // so all of the subscription to this user is an NFT of this class
    let class_id = generate_nft_class_id(env.clone());
    let symbol = generate_nft_symbol(env);
    let issue_class_msg = CoreumMsg::AssetNFT(assetnft::Msg::IssueClass {
        name: class_id, // class = user's DID they just registered
        symbol: symbol,                       // class = cropped DID
        description: Some("Subscriber badges".to_string()),
        uri: None,
        uri_hash: None,
        data: None,                            //
        features: Some(vec![DISABLE_SENDING]), // subscription NFTs are soul-bound tokens (SBTs)
        royalty_rate: Some("0".to_string()), // built-in royalties disabled for now, revenue model is externally managed
    });

    Ok(Response::<CoreumMsg>::default()
        .add_message(issue_class_msg))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut<CoreumQueries>,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response<CoreumMsg>, ContractError> {
    match msg {
        ExecuteMsg::Register { did, username } => execute_register(deps.into_empty(), env, info, username, did),
        ExecuteMsg::RemoveDID { did, username } => execute_remove(deps.into_empty(), env, info, username, did),
        ExecuteMsg::UpdateCredentialMerkleRoot { did, root } => {
            execute_update_vc_root(deps.into_empty(), env, info, did, root)
        }
        ExecuteMsg::SetSubscription { price, duration } => {
            set_subscription(deps.into_empty(), info, price, duration)
        }
        ExecuteMsg::Subscribe { did } => subscribe(deps, env, info, did),
    }
}

pub fn execute_register(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    username: String,
    did: String,
) -> Result<Response<CoreumMsg>, ContractError> {
    validate_name(&username)?;

    // TODO: agree how much will new DID registration cost
    let config_state = CONFIG.load(deps.storage)?;
    assert_sent_sufficient_coin(&info.funds, config_state.did_register_price)?;

    let key = username.clone();
    if (USERNAME_PROFILE_MAP.may_load(deps.storage, key)?).is_some() {
        // username is already taken
        return Err(ContractError::NameTaken { name: username });
    }

    // name is available
    let user_profile = ProfileInfo {
        wallet: info.sender,
        username: username.clone(),
        did: did.clone(),
        subscription_price: Some(coin(0, FEE_DENOM)), // TODO - get from env / use native coin?
        subscription_duration_days: Some(Uint64::from(7u64)),
        top_subscribers: LinkedList::new(),
        subscriber_count: Uint64::zero(),
    };

    // store for querying in all three buckets
    DID_PROFILE_MAP.save(deps.storage, user_profile.did.clone(), &user_profile)?;
    USERNAME_PROFILE_MAP.save(deps.storage, user_profile.username.clone(), &user_profile)?;
    WALLET_PROFILE_MAP.save(deps.storage, user_profile.wallet.to_string(), &user_profile)?;

    // create an NFT class for this DID
    // so all of the subscription to this user is an NFT of this class
    // let class_id = generate_nft_class_id(env.clone(), user_profile.wallet.to_string());
    // let symbol = generate_nft_symbol(env, &user_profile.wallet.to_string());
    // let issue_class_msg = CoreumMsg::AssetNFT(assetnft::Msg::IssueClass {
    //     name: class_id, // class = user's DID they just registered
    //     symbol: symbol,                       // class = cropped DID
    //     description: Some(
    //         format!("Subscribers of {} (DID: {})", user_profile.username, user_profile.did).to_string(),
    //     ),
    //     uri: None,
    //     uri_hash: None,
    //     data: None,                            //
    //     features: Some(vec![DISABLE_SENDING]), // subscription NFTs are soul-bound tokens (SBTs)
    //     royalty_rate: Some("0".to_string()), // built-in royalties disabled for now, revenue model is externally managed
    // });

    Ok(Response::<CoreumMsg>::default())
}

pub fn execute_remove(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    username: String,
    _did: String,
) -> Result<Response<CoreumMsg>, ContractError> {
    let did_record = USERNAME_PROFILE_MAP.may_load(deps.storage, username.clone())?;
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
    DID_PROFILE_MAP.remove(deps.storage, record.did);
    USERNAME_PROFILE_MAP.remove(deps.storage, record.username);
    WALLET_PROFILE_MAP.remove(deps.storage, record.wallet.to_string());

    Ok(Response::<CoreumMsg>::default())
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps<CoreumQueries>, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Config {} => to_json_binary(&CONFIG.load(deps.storage)?),

        QueryMsg::GetWalletDID { wallet } => query_resolver(deps, env, wallet, WALLET_PROFILE_MAP),
        QueryMsg::GetUsernameDID { username } => {
            query_resolver(deps, env, username, USERNAME_PROFILE_MAP)
        }
        QueryMsg::GetDID { did } => query_resolver(deps, env, did, DID_PROFILE_MAP),
        QueryMsg::GetMerkleRoot { did } => query_merkle_root(deps, env, did),
        QueryMsg::VerifyCredential {
            did,
            credential_hash,
            merkle_proofs,
        } => query_verify_credential(deps, env, did, credential_hash, merkle_proofs),
        QueryMsg::IsSubscriber { target_did, subscriber_wallet } => {
            let is_sub = is_subscriber(deps, env, target_did, subscriber_wallet);
            return Ok(is_sub);
            // let is_sub_deserialized = from_json::<Binary>(is_sub);
            // match is_sub_deserialized {
            //     Err(e) => return Err(StdError::GenericErr { msg: e.to_string() }),
            //     Ok(r) => {
            //         // consider the subscriber a subscriber if they own the NFT
            //         return to_json_binary(&true);
            //     }
            // }
        },
        QueryMsg::GetSubscriptionPrice { did } => get_subscription_price(deps, did),
        QueryMsg::GetSubscriptionDuration { did } => get_subscription_duration(deps, did),
        QueryMsg::GetSubscriptionInfo { did, subscriber } => {
            get_subscription_info(deps, env, did, subscriber)
        }
        // QueryMsg::GetSubscriberList { did, page, page_size } => {
        //     todo!()
        //     // get_subscriber_list(deps, did, page, page_size)
        // }
    }
}

type ResolverFnPointer<'a> = Map<'a, String, ProfileInfo>;
fn query_resolver(
    deps: Deps<CoreumQueries>,
    _env: Env,
    query_key: String,
    storage_resolver: ResolverFnPointer,
) -> StdResult<Binary> {

    // read the DID from an appropriate storage bucket
    let did_info = match storage_resolver.may_load(deps.storage, query_key) {
        Ok(info) => info,
        Err(_) => None,
    };

    let did_response: GetDIDResponse = GetDIDResponse { did_info: did_info };

    to_json_binary(&did_response)
}

fn query_merkle_root(deps: Deps<CoreumQueries>, _env: Env, did: String) -> StdResult<Binary> {
    let stored_root = CREDENTIAL.may_load(deps.storage, did)?;

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

    let stored_root = CREDENTIAL.may_load(deps.storage, did)?;

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
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    did: String,
    root: String,
) -> Result<Response<CoreumMsg>, ContractError> {
    // let config_state = config_storage(deps.storage).load()?;
    // assert_sent_sufficient_coin(&info.funds, config_state.did_register_price)?;

    let did_record = DID_PROFILE_MAP.may_load(deps.storage, did.clone())?;
    if did_record.is_none() {
        return Err(ContractError::NameNotExists { name: did });
    }

    // only account owner can update their VCs root
    let record = did_record.unwrap();
    if _info.sender != record.wallet {
        return Err(ContractError::Unauthorized {});
    }

    CREDENTIAL.save(deps.storage, did, &root)?;

    Ok(Response::<CoreumMsg>::default())
}
