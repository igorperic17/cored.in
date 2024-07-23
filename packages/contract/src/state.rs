use std::collections::LinkedList;

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Coin, Int64, Storage, Uint64};
use cosmwasm_storage::{
    bucket, bucket_read, singleton, singleton_read, Bucket, ReadonlyBucket, ReadonlySingleton,
    Singleton,
};

pub static CONFIG_KEY: &[u8] = b"config";
pub static DID_RESOLVER_KEY: &[u8] = b"didresolver";
pub static USERNAME_RESOLVER_KEY: &[u8] = b"usernameresolver"; // maps usernames to DIDs
pub static WALLET_RESOLVER_KEY: &[u8] = b"walletlresolver"; // maps wallet addresses to DIDs
pub static VC_MERKLE_RESOLVER_KEY: &[u8] = b"vcmerklelresolver"; // maps DIDs to Merkle root commitments
pub static PROFILE_INFO: &[u8] = b"profileinfo"; // stores top subscribers, subcription price, etc.
pub static SINGLE_SUBSCRIPTION: &[u8] = b"singlesub"; // stores info about a single (user -> subscriber) pair
pub static POST_KEY: &[u8] = b"postinfo"; // post info (includes optional bounty, creator tips, wheather accepted answer has been marked, claimed, etc)

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    pub did_register_price: Option<Coin>,
    pub owner: Addr
}

pub fn config_storage(storage: &mut dyn Storage) -> Singleton<Config> {
    singleton(storage, CONFIG_KEY)
}

pub fn config_storage_read(storage: &dyn Storage) -> ReadonlySingleton<Config> {
    singleton_read(storage, CONFIG_KEY)
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct DidInfo {
    pub wallet: Addr,
    pub did: String,
    pub username: String
}
// todo - PUT HERE all immutable public info

pub fn did_storage(storage: &mut dyn Storage) -> Bucket<DidInfo> {
    bucket(storage, DID_RESOLVER_KEY)
}

pub fn did_storage_read(storage: &dyn Storage) -> ReadonlyBucket<DidInfo> {
    bucket_read(storage, DID_RESOLVER_KEY)
}

pub fn username_storage(storage: &mut dyn Storage) -> Bucket<DidInfo> {
    bucket(storage, USERNAME_RESOLVER_KEY)
}

pub fn username_storage_read(storage: &dyn Storage) -> ReadonlyBucket<DidInfo> {
    bucket_read(storage, USERNAME_RESOLVER_KEY)
}

pub fn wallet_storage(storage: &mut dyn Storage) -> Bucket<DidInfo> {
    bucket(storage, WALLET_RESOLVER_KEY)
}

pub fn wallet_storage_read(storage: &dyn Storage) -> ReadonlyBucket<DidInfo> {
    bucket_read(storage, WALLET_RESOLVER_KEY)
}

pub fn vc_storage(storage: &mut dyn Storage) -> Bucket<String> {
    bucket(storage, VC_MERKLE_RESOLVER_KEY)
}

pub fn vc_storage_read(storage: &dyn Storage) -> ReadonlyBucket<String> {
    bucket_read(storage, VC_MERKLE_RESOLVER_KEY)
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct SubscriptionInfo {
    // pub subscriber: Addr,
    pub subscriber: String, // subscriber's DID
    pub subscribed_to: String, // DID of the profile subscribet to
    pub cost: Coin
}


#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ProfileInfo {
    pub subscription_price: Option<Coin>, // multiplier, if not set, defaults to zero
    pub top_subscribers: LinkedList<SubscriptionInfo>, // max 10 subscribers due to the gas limits
    pub subscriber_count: Uint64 // future proof to accommodate estimeted user base :)
}

pub fn single_subscription_storage(storage: &mut dyn Storage) -> Bucket<SubscriptionInfo> {
    bucket(storage, SINGLE_SUBSCRIPTION)
}

pub fn single_subscription_storage_read(storage: &dyn Storage) -> ReadonlyBucket<SubscriptionInfo> {
    bucket_read(storage, SINGLE_SUBSCRIPTION)
}

pub fn profile_storage(storage: &mut dyn Storage) -> Bucket<ProfileInfo> {
    bucket(storage, PROFILE_INFO)
}

pub fn profile_storage_read(storage: &dyn Storage) -> ReadonlyBucket<ProfileInfo> {
    bucket_read(storage, PROFILE_INFO)
}
