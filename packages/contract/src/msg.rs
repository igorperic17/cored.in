use cosmwasm_schema::QueryResponses;
use cosmwasm_std::Coin;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use crate::state::{Config, DidInfo};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub purchase_price: Option<Coin>,
    pub transfer_price: Option<Coin>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    // register DID and username with the sender's account
    Register {
        did: String,
        username: String
    },
    // remove the registered DID/username from the signing wallet
    // TODO: remove this before going public?
    RemoveDID {
        did: String,
        username: String
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema, QueryResponses)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    #[returns(Config)]
    Config {},
    
    #[returns(GetDIDResponse)]
    GetWalletDID { wallet: String },
    #[returns(GetDIDResponse)]
    GetUsernameDID { username: String },
    #[returns(GetDIDResponse)]
    GetDID { did: String },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct GetDIDResponse {
    pub did_info: Option<DidInfo>,
}
