use std::collections::LinkedList;
use std::fmt::Display;

use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Coin, Decimal, Timestamp, Uint64};
// use cosmwasm_storage::{
//     bucket, bucket_read, singleton, singleton_read, Bucket, ReadonlyBucket, ReadonlySingleton,
//     Singleton,
// };

// pub static CONFIG_KEY: &[u8] = b"config";
// pub static DID_RESOLVER_KEY: &[u8] = b"didresolver";
// pub static USERNAME_RESOLVER_KEY: &[u8] = b"usernameresolver"; // maps usernames to DIDs
// pub static WALLET_RESOLVER_KEY: &[u8] = b"walletlresolver"; // maps wallet addresses to DIDs

// pub static VC_MERKLE_RESOLVER_KEY: &[u8] = b"vcmerklelresolver"; // maps DIDs to Merkle root commitments

// pub static PROFILE_INFO: &[u8] = b"profileinfo"; // stores top subscribers, subcription price, etc.
// pub static SINGLE_SUBSCRIPTION: &[u8] = b"singlesub"; // stores info about a single (user -> subscriber) pair
// pub static POST_KEY: &[u8] = b"postinfo"; // post info (includes optional bounty, creator tips, wheather accepted answer has been marked, claimed, etc)

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    pub did_register_price: Option<Coin>,
    pub owner: Addr,
    pub subscription_fee: Decimal, // percentage from range [0.0, 1.0]
}
pub const CONFIG: Item<Config> = Item::new("config");

pub const DID_PROFILE_MAP: Map<String, ProfileInfo> = Map::new("didprofile");

pub const USERNAME_PROFILE_MAP: Map<String, ProfileInfo> = Map::new("usernameprofile");

pub const WALLET_PROFILE_MAP: Map<String, ProfileInfo> = Map::new("walletprofile");

pub const SUBSCRIPTION: Map<String, SubscriptionInfo> = Map::new("subscription");

pub const CREDENTIAL: Map<String, String> = Map::new("credential");


#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct SubscriptionInfo {
    // pub subscriber: Addr,
    pub subscriber: String,    // subscriber's DID
    pub subscribed_to: String, // DID of the profile subscribet to
    pub valid_until: Timestamp,
    pub cost: Coin,
}

impl Display for SubscriptionInfo {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let _ = f.write_str(format!("{:?}", self).as_str());
        Ok(())
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ProfileInfo {

    pub wallet: Addr,
    pub did: String,
    pub username: String,

    pub subscription_price: Option<Coin>, // multiplier, if not set, defaults to zero
    pub subscription_duration_days: Option<Uint64>, // number of days the subscription is valid for the price, defaults to 7
    pub top_subscribers: LinkedList<SubscriptionInfo>, // max 10 subscribers due to the gas limits
    pub subscriber_count: Uint64, // future proof to accommodate estimeted user base :)
}
