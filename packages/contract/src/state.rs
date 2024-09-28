use std::collections::LinkedList;

use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Coin, Decimal, Uint64};

use crate::models::subscription_info::SubscriptionInfo;

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
