use std::collections::LinkedList;
use std::fmt::Display;

use coreum_wasm_sdk::{nft::NFT, types::coreum::asset::nft::v1::DataDynamic};
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{from_json, Addr, Coin, Decimal, Timestamp, Uint64};
use prost::Message;
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

pub const CREDENTIAL: Map<String, String> = Map::new("credential");

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema, Eq)]
pub struct SubscriptionInfo {
    pub subscriber_wallet: Addr,
    pub subscribed_to_wallet: Addr,
    pub subscriber: String,    // subscriber's DID
    pub subscribed_to: String, // DID of the profile subscribed to
    pub valid_until: Timestamp,
    pub cost: Coin,
}

impl Ord for SubscriptionInfo {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        // order by subscriber, break ties with subscribed_to
        self.subscriber
            .cmp(&other.subscriber)
            .then_with(|| self.subscribed_to.cmp(&other.subscribed_to))
    }
}

impl PartialOrd for SubscriptionInfo {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

// helper trait imlementation to convert NFTResponse to SubscriptionInfo rapidly
impl From<NFT> for SubscriptionInfo {
    fn from(nft: NFT) -> Self {
        let sub_info = DataDynamic::decode(nft.data.unwrap().as_slice()).unwrap();
        let sub_info = from_json::<SubscriptionInfo>(&sub_info.items[0].data).unwrap();
        sub_info
    }
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
