use crate::coin_helpers::{assert_sent_sufficient_coin, generate_nft_class_id, generate_nft_id};
use crate::error::ContractError;
use crate::state::{
    did_storage_read, profile_storage, profile_storage_read, single_subscription_storage, single_subscription_storage_read, wallet_storage_read, SubscriptionInfo
};
use coreum_wasm_sdk::assetnft;
use coreum_wasm_sdk::core::CoreumMsg;
use cosmwasm_std::{
    coin, coins, from_json, to_json_binary, BankMsg, Binary, Coin, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult, Uint128, Uint64
};

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
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    subscribe_to_did: String,
) -> Result<Response<CoreumMsg>, ContractError> {

    // check if request has sufficient amount of coins attached
    let price: Coin = from_json(get_subscription_price(
        deps.as_ref(),
        subscribe_to_did.clone(),
    )?)?;
    deps.api.debug(format!("sub price: {}", price.amount).as_str());
    assert_sent_sufficient_coin(&info.funds, Some(price.clone()))?;

    let mut response = Response::default();

    // compute the refund
    if price.amount != Uint128::zero() {
        // returns error if 0 or 2+ coins are sent
        let mut coins_sent: Option<&Coin> = None;
        if !info.funds.is_empty() && info.funds.len() < 2 { coins_sent = Some(info.funds.get(0).unwrap()) };
    
        if coins_sent.is_none() {
            return Err(ContractError::InsufficientFundsSend { sent: Some(coin(0u128, price.denom.clone())), expected: Some(price.clone()) })
        } else {
            // if yes, refund the surplus
            let refund_amount = coins_sent.unwrap()
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

            response = response.add_attribute("refund", refund.to_string());
        }
    }

    // convert the sender wallet to DID
    let subscriber_did = wallet_storage_read(deps.storage)
        .may_load(info.sender.as_bytes())?
        .unwrap();

    // convert the subscribed_to DID into a wallet
    let subscribed_to_wallet = did_storage_read(deps.storage)
        .may_load(subscribe_to_did.clone().as_bytes())?
        .unwrap();

    // make sure there's no existing valid subscription
    let subscription_key = subscriber_did.did.clone() + subscribe_to_did.as_str();
    let existing_sub = single_subscription_storage_read(deps.storage).load(subscription_key.as_bytes());
    if existing_sub.is_ok() {
        let existing_subscription = existing_sub.unwrap();
        if existing_subscription.valid_until.seconds() < env.block.time.seconds() {
            return Err(ContractError::ExistingSubscriptionFound { subscription_info: existing_subscription });
        }
    }

    // store a single subscription info
    let subscription = SubscriptionInfo {
        subscriber: subscriber_did.did.clone(),
        subscribed_to: subscribe_to_did.clone(),
        valid_until: env.block.time.plus_days(30),
        cost: price.clone(),
    };

    single_subscription_storage(deps.storage).save(
        subscription_key.as_ref(),
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

    // // mint the subscription NFT
    // let nft_class_id = generate_nft_class_id(env.clone(), subscribe_to_did.clone());
    // let nft_id = generate_nft_id(env.clone(), subscriber_did.clone().did, subscribe_to_did);
    // let valid_until = env.block.time.plus_days(30); // valid for a month, ability to subscribe for more/less TBD
    // let mint_res = mint_nft(info.clone(), nft_class_id, nft_id, Some(to_json_binary(&valid_until).unwrap()));
    // if mint_res.is_err() {
    //     return Err(ContractError::SubscriptionNFTMintingError {});
    // } else {
    //     let sub_msg = mint_res.unwrap().messages;
    //     deps.api.debug(format!("MINT NFT messages: {:?}", sub_msg).as_str());
    //     Response::new().add_submessages(sub_msg);
    // }

    // payout
    // deps.api.debug("Trying to pay the subscriber...");
    let cored_in_commission_fraction = (1u128, 20u128); // TODO: hardcoded to 5% = 1/20 for now, TBD and configurable
    let cored_in_commission = price.amount.checked_mul_floor(cored_in_commission_fraction).unwrap();
    let owner_payout = price.amount.checked_sub(cored_in_commission).unwrap();
    // deps.api.debug(format!("Subscriber payment {}, cored.in commission {}", owner_payout, cored_in_commission).as_str());

    // deps.api.debug(format!("Trying to pay {}...", subscribed_to_wallet.wallet.to_string()).as_str());
    let pay_owner_msg = BankMsg::Send { to_address: subscribed_to_wallet.wallet.to_string(), amount: coins(owner_payout.u128(), "ucore") };

    Ok(response
        .add_attribute("action", "subscribe")
        .add_attribute("subscribed_to_did", subscribed_to_wallet.did)
        .add_attribute("subscribed_to_wallet", subscribed_to_wallet.wallet)
        // .add_attribute("valid_until", valid_until.to_string())
        .add_attribute("subscriber", info.sender)
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
    deps: Deps,
    env: Env,
    did: String,
    subscriber: String,
) -> StdResult<Binary> {
    let key = format!("{}{}", subscriber, did); // Concatenate strings and store in a variable
    let subscriber_info =
        single_subscription_storage_read(deps.storage).may_load(key.as_bytes())?;

    // rely on chain internal state instead of the NFT data until minting is fixed
    let response = match subscriber_info {
        None => false,
        Some(sub_info) => sub_info.valid_until.seconds() >= env.block.time.seconds()
    };

    // check NFT 
    // doc ref: https://github.com/CoreumFoundation/coreum-wasm-sdk/blob/main/src/nft.rs

    // // issues NFTs will have IDs of the form {contract_address}-{profile_did}-{subscriber_did}
    // let class_id = generate_nft_class_id(env.clone(), subscriber_info.clone().unwrap().subscribed_to);
    // let nft_id = generate_nft_id(env, subscriber_info.clone().unwrap().subscriber, subscriber_info.unwrap().subscribed_to);
    // let request = CoreumQueries::NFT(nft::Query::NFT {
    //     class_id,
    //     id: nft_id,
    // })
    // .into();
    // // getting Err(GenericErr { msg: "Querier system error: Unsupported query type: custom" })
    // let res = deps.querier.query::<nft::NFTResponse>(&request);
    // println!("{:?}", res);

    to_json_binary(&response)
}

// gets current subscription cost
pub fn get_subscription_price(deps: Deps, did: String) -> StdResult<Binary> {
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
    deps: DepsMut,
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
