// src/lib.rs

pub mod contract;
pub mod error;
pub mod msg;
pub mod state;
pub mod subscription;
pub mod coin_helpers;
pub mod merkle_tree;
pub mod dao;

#[cfg(test)]
mod tests {
    mod common;
    mod credential_tests;
    mod registration_tests;
    mod subscription;
}
