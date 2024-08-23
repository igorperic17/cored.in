use std::collections::LinkedList;

use cosmwasm_schema::QueryResponses;
use cosmwasm_std::{Coin, Decimal, Uint64};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use crate::state::{Config, ProfileInfo, SubscriptionInfo};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub purchase_price: Option<Coin>,
    pub transfer_price: Option<Coin>,
    pub subscription_fee: Decimal
}

impl InstantiateMsg {
    pub fn zero() -> Self {
        InstantiateMsg {
            purchase_price: None,
            transfer_price: None,
            subscription_fee: Decimal::zero()
        }
    }
}

impl Default for InstantiateMsg {
    fn default() -> Self {
        Self { 
            purchase_price: None, 
            transfer_price: None, 
            subscription_fee: Decimal::percent(5) 
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    // register DID and username with the sender's account
    Register { did: String, username: String },
    // remove the registered DID/username from the signing wallet
    // TODO: remove this before going public?
    RemoveDID { did: String, username: String },
    // register DID and username with the sender's account
    UpdateCredentialMerkleRoot { did: String, root: String },
    // set subscription price for a DID
    // this sets only the multiplierfor, final price = number of subscribers * multiplier
    // defualt value = 1
    SetSubscription { price: Coin, duration: Uint64 },
    // subscribe to a DID
    Subscribe { did: String },
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
    #[returns(GetMerkleRootResponse)]
    GetMerkleRoot { did: String },

    // verify if the the provided credential is in the set of VCs for given DID
    #[returns(bool)]
    VerifyCredential {
        did: String,
        credential_hash: String,
        merkle_proofs: LinkedList<String>,
    },

    // check if the user is a subscriber to the DID
    #[returns(bool)]
    IsSubscriber { target_did: String, subscriber_wallet: String },

    // returns the subscription price for a profile
    #[returns(Coin)]
    GetSubscriptionPrice { did: String },

    // returns the subscription price for a profile
    #[returns(Uint64)]
    GetSubscriptionDuration { did: String },

    // returns subscription info
    #[returns(GetSubscriptionInfoResponse)]
    GetSubscriptionInfo { did: String, subscriber: String },

    // return the list of subscribers
    #[returns(GetSubscriptionListResponse)]
    GetSubscribers { wallet: String, page: Uint64, page_size: Uint64 },

    // return the list of subscriptions
    #[returns(GetSubscriptionListResponse)]
    GetSubscriptions { wallet: String, page: Uint64, page_size: Uint64 },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct GetDIDResponse {
    pub did_info: Option<ProfileInfo>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct GetMerkleRootResponse {
    pub root: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct GetSubscriptionInfoResponse {
    pub info: Option<SubscriptionInfo>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct GetSubscriptionListResponse {
    pub subscribers: Vec<SubscriptionInfo>, // list of subscriber's DIDs
}

