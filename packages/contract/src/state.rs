use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Coin, Storage, Addr};
use cosmwasm_storage::{
    bucket, bucket_read, singleton, singleton_read, Bucket, ReadonlyBucket, ReadonlySingleton,
    Singleton,
};

pub static NAME_RESOLVER_KEY: &[u8] = b"nameresolver";
pub static CONFIG_KEY: &[u8] = b"config";
pub static CREDENTIAL_RESOLVER_KEY: &[u8] = b"credentialresolver";

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Config {
    pub purchase_price: Option<Coin>,
    pub transfer_price: Option<Coin>,
    pub owner: Addr
}

pub fn config(storage: &mut dyn Storage) -> Singleton<Config> {
    singleton(storage, CONFIG_KEY)
}

pub fn config_read(storage: &dyn Storage) -> ReadonlySingleton<Config> {
    singleton_read(storage, CONFIG_KEY)
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct UserInfo {
    // pub owner: Addr, // TODO
    pub did: String,
    pub username: String,
    pub bio: String,
}
// todo - PUT HERE all immutable public info

pub fn resolver(storage: &mut dyn Storage) -> Bucket<UserInfo> {
    bucket(storage, NAME_RESOLVER_KEY)
}

pub fn resolver_read(storage: &dyn Storage) -> ReadonlyBucket<UserInfo> {
    bucket_read(storage, NAME_RESOLVER_KEY)
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub enum CredentialEnum {
    Degree { data: CredentialDegree, vc_hash: String},
    Employment { data: CredentialEmployment, vc_hash: String },
    Event { data: CredentialEvent, vc_hash: String}
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct CredentialDegree {
    pub owner: String, // wallet
    pub institution_name: String,
    pub institution_did: String,
    pub year: u64, // graduation year
}
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct CredentialEmployment {
    pub owner: String, // wallet
    pub institution_name: String,
    pub institution_did: String,
    pub start_year: Option<u64>,
    pub end_year: Option<u64>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct CredentialEvent {
    pub owner: String, // wallet
    pub event_name: String,
    pub organizer_did: String,
    pub year: Option<u64>,
}

pub fn credential(storage: &mut dyn Storage) -> Bucket<Vec<CredentialEnum>> {
    bucket(storage, CREDENTIAL_RESOLVER_KEY)
}

pub fn credential_read(storage: &dyn Storage) -> ReadonlyBucket<Vec<CredentialEnum>> {
    bucket_read(storage, CREDENTIAL_RESOLVER_KEY)
}



// use schemars::JsonSchema;
// use serde::{Deserialize, Serialize};

// use cosmwasm_std::{Addr, Coin, Storage};
// use cosmwasm_storage::{
//     bucket, bucket_read, singleton, singleton_read, Bucket, ReadonlyBucket, ReadonlySingleton,
//     Singleton,
// };

// pub static NAME_RESOLVER_KEY: &[u8] = b"nameresolver";
// pub static CONFIG_KEY: &[u8] = b"config";

// #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
// pub struct Config {
//     pub purchase_price: Option<Coin>,
//     pub transfer_price: Option<Coin>,
// }

// pub fn config(storage: &mut dyn Storage) -> Singleton<Config> {
//     singleton(storage, CONFIG_KEY)
// }

// pub fn config_read(storage: &dyn Storage) -> ReadonlySingleton<Config> {
//     singleton_read(storage, CONFIG_KEY)
// }

// #[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
// pub struct NameRecord {
//     pub owner: Addr,
// }

// pub fn resolver(storage: &mut dyn Storage) -> Bucket<NameRecord> {
//     bucket(storage, NAME_RESOLVER_KEY)
// }

// pub fn resolver_read(storage: &dyn Storage) -> ReadonlyBucket<NameRecord> {
//     bucket_read(storage, NAME_RESOLVER_KEY)
// }