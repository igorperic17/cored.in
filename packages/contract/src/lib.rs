// src/lib.rs

pub mod contract;
pub mod error;
pub mod msg;
pub mod state;
pub mod coin_helpers;

#[cfg(test)]
mod tests {
    mod common;
    mod credential_tests;
    mod registration_tests;
}
