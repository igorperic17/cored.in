use crate::error::ContractError;
use crate::state::{
    profile_storage, profile_storage_read, wallet_storage_read,
};
use coreum_wasm_sdk::core::{CoreumMsg, CoreumQueries};
use cosmwasm_std::{Coin, DepsMut, MessageInfo, Response};

// an account invoking this will collect all of the accumulated subscription commissions from the contract
// TODO: replace by DAO-like voting by admins
pub fn collect_fees(
    deps: DepsMut<CoreumQueries>,
    info: MessageInfo,
) -> Result<Response<CoreumMsg>, ContractError> {
    
    // TODO: implement

    Ok(Response::<CoreumMsg>::default())
}
