// src/lib.rs

pub mod coin_helpers;
pub mod contract;
pub mod dao;
pub mod error;
pub mod merkle_tree;
pub mod msg;
pub mod post;
pub mod state;
pub mod subscription;

pub mod models {
    pub mod did;
    pub mod subscription_info;
}

#[cfg(test)]
mod tests {
    mod test_common;
    mod test_merkle_tree;
    mod test_subscription;
}
