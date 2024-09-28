use crate::models::did::DID;
use cw_storage_plus::Map;
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr, Coin, Timestamp};

pub const POST: Map<String, PostInfo> = Map::new("post");

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema, Eq)]
pub enum PostType {
    // traditional social post with no advanced behavior
    Microblog,
    // message to another user
    Message(DID),
    // mandatory bounty (includes 10% collateral)
    Gig(Coin),
}
// stores the economic/financial aspects of a post
// content and editable metadata are stored in the backend on purpose
// TBD: store encrypted data on-chain in the future to remove dependency on the backend
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema, Eq)]
pub struct PostInfo {
    pub id: String,   // off-chain DB reference
    pub hash: String, // integrity check
    pub author: Addr,
    pub post_type: PostType,
    pub created_on: Timestamp,
    pub vault: Coin, // storing tips and submission stakes
}
