use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Coin, Storage, Addr};
use cosmwasm_storage::{
    bucket, bucket_read, singleton, singleton_read, Bucket, ReadonlyBucket, ReadonlySingleton,
    Singleton,
};

pub static CONFIG_KEY: &[u8] = b"config";
pub static DID_RESOLVER_KEY: &[u8] = b"didresolver";
pub static USERNAME_RESOLVER_KEY: &[u8] = b"usernameresolver";
pub static WALLET_RESOLVER_KEY: &[u8] = b"walletlresolver";
pub static VC_MERKLE_RESOLVER_KEY: &[u8] = b"vcmerklelresolver";
pub static SUBSCRIPTION_PRICE_KEY: &[u8] = b"subscriptionprice";
pub static SUBSCRIPTION_KEY: &[u8] = b"subscription";

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
    pub subscriber: Addr,
    pub did: String,
}

pub fn subscription_price_storage(storage: &mut dyn Storage) -> Bucket<Coin> {
    bucket(storage, SUBSCRIPTION_PRICE_KEY)
}

pub fn subscription_price_storage_read(storage: &dyn Storage) -> ReadonlyBucket<Coin> {
    bucket_read(storage, SUBSCRIPTION_PRICE_KEY)
}

pub fn subscription_storage(storage: &mut dyn Storage) -> Bucket<SubscriptionInfo> {
    bucket(storage, SUBSCRIPTION_KEY)
}

pub fn subscription_storage_read(storage: &dyn Storage) -> ReadonlyBucket<SubscriptionInfo> {
    bucket_read(storage, SUBSCRIPTION_KEY)
}
