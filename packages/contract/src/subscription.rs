use crate::coin_helpers::assert_sent_sufficient_coin;
use crate::error::ContractError;
use crate::state::{
    profile_storage, profile_storage_read, single_subscription_storage,
    single_subscription_storage_read, wallet_storage_read, SubscriptionInfo,
};
use coreum_wasm_sdk::assetnft;
use coreum_wasm_sdk::core::{CoreumMsg, CoreumQueries};
use coreum_wasm_sdk::nft;
use cosmwasm_std::{
    coin, from_json, to_json_binary, BankMsg, Binary, Coin, Deps, DepsMut, Int64, MessageInfo, QueryRequest, Response, StdError, StdResult, Uint128, Uint64
};
use std::cmp::min;

// hash function used to map an arbitrary length string (i.e. DID) into a string of a specific lenght
// needed for using DID as part of the NFT id
pub fn hash_did(s: &str, n: usize) -> String {
    let mut result = vec![0u8; n];
    
    for (i, &byte) in s.as_bytes().iter().enumerate() {
        result[i % n] = ((result[i % n] as u8 + byte) % 128) as u8; // Circular addition and keep within ASCII range
    }

    // Convert the result to a string
    result.iter().map(|&c| (c as char)).collect()
}

pub fn subscribe(
    deps: DepsMut<CoreumQueries>,
    info: MessageInfo,
    subscribe_to_did: String,
) -> Result<Response<CoreumMsg>, ContractError> {
    // check if subscription is paid
    let price: Coin = from_json(get_subscription_price(
        deps.as_ref(),
        subscribe_to_did.clone(),
    )?)?;
    // let price = subscription_price_storage(deps.storage)
    //     .may_load(did.as_bytes())?
    //     .ok_or(ContractError::NameNotExists { name: did.clone() })?;

    // did a subscriber attach suffiicient amount of coins to this transaction?
    assert_sent_sufficient_coin(&info.funds, Some(price.clone()))?;

    // if yes, refund the surplus
    let refund_amount = info.funds[0]
        .amount
        .checked_sub(price.amount)
        .map_err(|_| StdError::generic_err("Overflow error"))?;
    let mut refund = Coin {
        denom: price.denom.clone(),
        amount: refund_amount,
    };

    if refund.amount.is_zero() {
        refund = Coin {
            denom: String::new(),
            amount: 0u128.into(),
        };
    }

    // convert the sender wallet to DID
    let subscriber_did = wallet_storage_read(deps.storage)
        .may_load(info.sender.as_bytes())?
        .unwrap();

    // store a single subscription info
    let subscription = SubscriptionInfo {
        subscriber: subscriber_did.did.clone(),
        subscribed_to: subscribe_to_did.clone(),
        cost: price.clone(),
    };

    single_subscription_storage(deps.storage).save(
        (subscriber_did.did.clone() + subscribe_to_did.clone().as_str()).as_bytes(),
        &subscription,
    )?;

    // increment the subscription counter for the profile
    let mut profile_info = profile_storage_read(deps.storage)
        .may_load(subscribe_to_did.as_bytes())?
        .unwrap();
    profile_info.subscriber_count += Uint64::from(1u64);
    profile_storage(deps.storage)
        .save(subscribe_to_did.as_bytes(), &profile_info)
        .expect("Error incrementing subscriber count");

    // mint the subscription NFT

    // TODO: change this to {contract_address}-{profile_did}
    // issued NFTs will have IDs of the form {contract_address}-{profile_did}-{subscriber_did}
    let clipped_did_length = min(26, min(subscribe_to_did.len(), subscriber_did.did.len())); // max length of NFT id is 100 so we need to crop them, using last chars to avoid collisions
    let class_id = format!(
        "{}-{}",
        "coredin", // TODO - use contract address
        subscribe_to_did.to_string()[subscribe_to_did.len() - clipped_did_length..].to_string(),
    );
    let nft_id = format!(
        "{}-{}",
        class_id,
        subscriber_did.did.to_string()[subscriber_did.did.len() - clipped_did_length..].to_string()
    );
    let mint_res = mint_nft(info.clone(), class_id, nft_id, None).unwrap();


    // payout
    let cored_in_commission_fraction = (1u128, 20u128); // TODO: hardcoded to 5% = 1/20 for now, TBD and configurable
    let cored_in_commission = price.amount.checked_mul_floor(cored_in_commission_fraction).unwrap();
    let owner_payout = price.amount.checked_sub(cored_in_commission).unwrap();

    let pay_owner_msg = BankMsg::Send { to_address: subscriber_did.wallet.to_string(), amount: vec![coin(owner_payout.u128(), "core")] };
    

    Ok(Response::default()
        .add_attribute("action", "subscribe")
        .add_attribute("subscribed_to", subscribe_to_did)
        .add_attribute("subscriber", info.sender)
        .add_attribute("refund", refund.to_string())
        .add_message(pay_owner_msg))
}

fn mint_nft(
    // _deps: DepsMut<CoreumQueries>,
    info: MessageInfo,
    class_id: String,
    nft_id: String,
    // recipient_wallet: String, // if we need to mint into someone else's wallet in the future...
    data: Option<Binary>,
) -> Result<Response<CoreumMsg>, ContractError> {
    let msg = CoreumMsg::AssetNFT(assetnft::Msg::Mint {
        class_id: class_id.clone(),
        id: nft_id.clone(),
        uri: None,
        uri_hash: None,
        data: data.clone(),
        recipient: Some(info.sender.to_string()),
    });

    Ok(Response::new()
        .add_attribute("method", "mint_nft")
        .add_attribute("class_id", class_id)
        .add_attribute("nft_id", nft_id)
        .add_attribute("nft_data", data.unwrap_or_default().to_string())
        .add_message(msg))
}

pub fn is_subscriber(
    deps: Deps<CoreumQueries>,
    did: String,
    subscriber: String,
) -> StdResult<Binary> {
    let key = format!("{}{}", subscriber, did); // Concatenate strings and store in a variable
    let subscriber_info =
        single_subscription_storage_read(deps.storage).may_load(key.as_bytes())?;

    let response = subscriber_info.is_some();

    // check NFT
    // doc ref: https://github.com/CoreumFoundation/coreum-wasm-sdk/blob/main/src/nft.rs

    // let get_nft_message = assetnft::Query::Class { id: did };

    // TODO: change this to {contract_address}-{profile_did}
    // issues NFTs will have IDs of the form {contract_address}-{profile_did}-{subscriber_did}
    let clipped_did_length = min(26, min(did.len(), subscriber.len())); // max length of NFT id is 100 so we need to crop them, using last chars to avoid collisions
    let class_id = format!(
        "{}-{}",
        "coredin", // TODO - use contract address
        did.to_string()[did.len() - clipped_did_length..].to_string(),
    );
    let nft_id = format!(
        "{}-{}",
        class_id,
        subscriber.to_string()[subscriber.len() - clipped_did_length..].to_string()
    );
    let request: QueryRequest<CoreumQueries> = CoreumQueries::NFT(nft::Query::NFT {
        class_id,
        id: nft_id,
    })
    .into();
    let res: Result<nft::NFTResponse, StdError> = deps.querier.query::<nft::NFTResponse>(&request);
    println!("{:?}", res);

    to_json_binary(&response)
}

// gets current subscription cost
pub fn get_subscription_price(deps: Deps<CoreumQueries>, did: String) -> StdResult<Binary> {
    let profile_info = profile_storage_read(deps.storage).load(did.as_bytes());

    match profile_info {
        Err(e) => return Err(e),
        Ok(profile) => {
            let mut subscriber_price: Option<Coin> = profile.subscription_price;
            if subscriber_price.is_some() {
                let mut scaled_price = subscriber_price.unwrap();
                scaled_price.amount *= Uint128::from(profile.subscriber_count + Uint64::one());
                subscriber_price = Some(scaled_price);
            }

            return to_json_binary(&subscriber_price);
        }
    }
}

pub fn set_subscription_price(
    deps: DepsMut<CoreumQueries>,
    info: MessageInfo,
    price: Coin,
) -> Result<Response<CoreumMsg>, ContractError> {
    let did_info = wallet_storage_read(deps.storage)
        .may_load(info.sender.as_bytes())
        .expect("No DID registerred with the current wallet");
    println!("Set sub price: {:?}", did_info);
    let did_info_unwrapped = did_info.unwrap();
    println!("Set sub price UNWRAPPED: {:?}", did_info_unwrapped);

    let mut profile_info = profile_storage_read(deps.storage)
        .may_load(did_info_unwrapped.did.as_bytes())
        .expect("Profile info for DID not found")
        .expect("Stored profile info is empty");
    profile_info.subscription_price = Some(price.clone());
    profile_storage(deps.storage)
        .save(did_info_unwrapped.did.as_bytes(), &profile_info)
        .expect("Error storing the new subscription price");

    Ok(Response::<CoreumMsg>::default())
}
