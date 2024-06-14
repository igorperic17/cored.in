// src/tests/credential_tests.rs

#[cfg(test)]
mod tests {
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{from_binary, Addr};
    use std::collections::LinkedList;
    use crate::contract::{execute, query};
    use crate::msg::{ExecuteMsg, QueryMsg};
    use crate::tests::common::common::{mock_init_no_price, mock_alice_registers_name};
    use sha2::{Sha256, Digest};
    use hex;

    fn calculate_merkle_root(leaf: &str, proofs: &[&str]) -> String {
        let mut current_hash = leaf.to_string();
        for proof in proofs {
            let mut hasher = Sha256::new();
            if proof.to_string() < current_hash {
                hasher.update(proof.as_bytes());
                hasher.update(current_hash.as_bytes());
            } else {
                hasher.update(current_hash.as_bytes());
                hasher.update(proof.as_bytes());
            }
            current_hash = hex::encode(hasher.finalize());
        }
        current_hash
    }

    #[test]
    fn register_and_update_vc_root() {
        let mut deps = mock_dependencies();
        mock_init_no_price(deps.as_mut());
        mock_alice_registers_name(deps.as_mut(), &[]);

        // Alice updates VC root
        let info = mock_info("alice_key", &[]);
        let msg = ExecuteMsg::UpdateCredentialMerkeRoot {
            did: "alice_did".to_string(),
            root: "new_merkle_root".to_string(),
        };
        let _res = execute(deps.as_mut(), mock_env(), info, msg)
            .expect("contract successfully handles UpdateCredentialMerkeRoot message");

        // Query to verify the root
        let query_msg = QueryMsg::VerifyCredential {
            did: "alice_did".to_string(),
            credential_hash: "credential_hash".to_string(),
            merkle_proofs: LinkedList::new(),
        };
        let res = query(deps.as_ref(), mock_env(), query_msg).unwrap();
        let value: bool = from_binary(&res).unwrap();
        assert!(!value, "Expected verification to fail without proper proofs");
    }

    #[test]
    fn verify_credential_not_present() {
        let mut deps = mock_dependencies();
        mock_init_no_price(deps.as_mut());
        mock_alice_registers_name(deps.as_mut(), &[]);

        // Query to verify the root before any VC root is set
        let query_msg = QueryMsg::VerifyCredential {
            did: "alice_did".to_string(),
            credential_hash: "credential_hash".to_string(),
            merkle_proofs: LinkedList::new(),
        };
        let res = query(deps.as_ref(), mock_env(), query_msg);
        assert!(res.is_err(), "Expected verification to fail when no VC root is set");
    }

    #[test]
    fn verify_credential_success() {
        let mut deps = mock_dependencies();
        mock_init_no_price(deps.as_mut());
        mock_alice_registers_name(deps.as_mut(), &[]);

        // Update VC root
        let info = mock_info("alice_key", &[]);
        let leaf = "credential_hash";
        let proofs = vec!["proof1", "proof2"];
        let root = calculate_merkle_root(leaf, &proofs);

        let msg = ExecuteMsg::UpdateCredentialMerkeRoot {
            did: "alice_did".to_string(),
            root: root.clone(),
        };
        let _res = execute(deps.as_mut(), mock_env(), info, msg)
            .expect("contract successfully handles UpdateCredentialMerkeRoot message");

        // Query to verify the credential
        let mut merkle_proofs = LinkedList::new();
        for proof in proofs {
            merkle_proofs.push_back(proof.to_string());
        }

        let query_msg = QueryMsg::VerifyCredential {
            did: "alice_did".to_string(),
            credential_hash: leaf.to_string(),
            merkle_proofs,
        };
        let res = query(deps.as_ref(), mock_env(), query_msg).unwrap();
        let value: bool = from_binary(&res).unwrap();
        assert!(value, "Expected verification to succeed with correct proofs");
    }

    #[test]
    fn verify_large_number_of_credentials() {
        let mut deps = mock_dependencies();
        mock_init_no_price(deps.as_mut());
        mock_alice_registers_name(deps.as_mut(), &[]);

        // Register a large number of credentials
        let info = mock_info("alice_key", &[]);
        let leaf = "credential_hash";
        let proofs: Vec<String> = (0..10000).map(|i| format!("proof{}", i)).collect();
        let root = calculate_merkle_root(leaf, &proofs.iter().map(|s| s.as_str()).collect::<Vec<&str>>());

        let msg = ExecuteMsg::UpdateCredentialMerkeRoot {
            did: "alice_did".to_string(),
            root: root.clone(),
        };
        let _res = execute(deps.as_mut(), mock_env(), info, msg)
            .expect("contract successfully handles UpdateCredentialMerkeRoot message");

        // Simulate verifying with a large number of proofs
        let mut merkle_proofs = LinkedList::new();
        for proof in proofs {
            merkle_proofs.push_back(proof);
        }

        let query_msg = QueryMsg::VerifyCredential {
            did: "alice_did".to_string(),
            credential_hash: leaf.to_string(),
            merkle_proofs,
        };
        let res = query(deps.as_ref(), mock_env(), query_msg).unwrap();
        let value: bool = from_binary(&res).unwrap();
        assert!(value, "Expected verification to succeed with correct proofs even with large number of credentials");
    }
}
