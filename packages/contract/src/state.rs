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