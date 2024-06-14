use cosmwasm_std::{to_json_binary, Binary, Coin, Deps, DepsMut, MessageInfo, Response, StdError, StdResult};
use crate::state::{subscription_price_storage, subscription_storage, subscription_storage_read, SubscriptionInfo};
use crate::error::ContractError;
use crate::coin_helpers::assert_sent_sufficient_coin;
use cosmwasm_storage::{ReadonlyBucket, Bucket};

pub fn set_subscription_price(
    deps: DepsMut,
    info: MessageInfo,
    price: Coin,
) -> Result<Response, ContractError> {
    let key = info.sender.as_bytes();
    subscription_price_storage(deps.storage).save(key, &price)?;
    Ok(Response::default())
}

pub fn subscribe(
    deps: DepsMut,
    info: MessageInfo,
    did: String,
) -> Result<Response, ContractError> {
    let price = subscription_price_storage(deps.storage)
        .may_load(did.as_bytes())?
        .ok_or(ContractError::NameNotExists { name: did.clone() })?;

    assert_sent_sufficient_coin(&info.funds, Some(price.clone()))?;

    let refund_amount = info.funds[0].amount.checked_sub(price.amount)
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

    let subscription = SubscriptionInfo {
        subscriber: info.sender.clone(),
        did: did.clone(),
    };

    subscription_storage(deps.storage).save(
        (did.clone() + &info.sender.to_string()).as_bytes(),
        &subscription,
    )?;

    Ok(Response::new()
        .add_attribute("action", "subscribe")
        .add_attribute("did", did)
        .add_attribute("subscriber", info.sender)
        .add_attribute("refund", refund.to_string()))
}


pub fn is_subscriber(
    deps: Deps,
    did: String,
    subscriber: String,
) -> StdResult<Binary> {
    let key = format!("{}{}", did, subscriber);  // Concatenate strings and store in a variable
    let subscriber_info = subscription_storage_read(deps.storage).may_load(key.as_bytes())?;

    let response = subscriber_info.is_some();
    to_json_binary(&response)
}

