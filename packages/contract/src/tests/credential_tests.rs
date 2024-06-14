#[cfg(test)]
mod tests {
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::from_json;
    use std::collections::LinkedList;
    use crate::contract::{execute, query};
    use crate::msg::{ExecuteMsg, QueryMsg};
    use crate::tests::common::common::{mock_init_no_price, mock_alice_registers_name};

    use crate::merkle_tree::MerkleTree;

    #[cfg(test)]
    mod tests {
        use super::MerkleTree;
    
        #[test]
        fn test_merkle_tree_logic() {
            // Random set of credentials
            let credentials = vec![
                "credential1",
                "credential2",
                "credential3",
                "credentia42",
                "asudhiauds"
            ];
    
            // Create a new Merkle tree from credentials
            let mut merkle_tree = MerkleTree::new();
            for cred in credentials {
                merkle_tree.add_credential(cred.to_string());
            }
    
            // println!("Calculated Merkle Root: {}", merkle_tree.get_root());
    
            // Pick a credential and generate proofs for it
            let target_credential = "credential2".to_string();
            let proofs = merkle_tree.generate_proof(&target_credential);
            // println!("Generated Proofs for {}: {:?}", target_credential, proofs);
    
            // Verify the root using the generated proofs
            let verification_result = merkle_tree.verify_proof(&target_credential.to_string(), proofs.clone().unwrap());
            println!("Verification Result: {}", verification_result);
    
            // Check if the verification result matches the original root
            assert!(verification_result, "Merkle root verification failed");
    
            // Negative case: Verify a non-existent credential
            let non_existent_credential = "non_existent_credential".to_string();
            let non_existent_verification_result = merkle_tree.verify_proof(&non_existent_credential, proofs.unwrap());
            println!("Non-existent Verification Result: {}", non_existent_verification_result);
    
            // The verification result should not match the original root
            assert!(!non_existent_verification_result, "Non-existent credential verification should fail");
        }
    }

    #[test]
    fn store_and_verify_dummy_credentials() {
        let mut deps = mock_dependencies();
        mock_init_no_price(deps.as_mut());
        mock_alice_registers_name(deps.as_mut(), &[]);

        // Update VC root with dummy credentials
        let info = mock_info("alice_key", &[]);
        // let credentials = vec!["dummy_credential_hash1", "dummy_credential_hash2", "dummy_credential_hash3"];
        let credentials = vec![
            String::from("duammyscresoiatialhah1"),
            String::from("credential2"),
            String::from("dummycredentialhash3"),
        ];

        // Create a new Merkle tree from credentials
        let mut merkle_tree = MerkleTree::new();
        for cred in credentials {
            merkle_tree.add_credential(cred);
        }
        let root = merkle_tree.get_root();

        println!("Calculated Merkle Root for dummy credentials: {}", root);

        let msg = ExecuteMsg::UpdateCredentialMerkleRoot {
            did: String::from("alice_did"),
            root: root.clone(),
        };
        let _res = execute(deps.as_mut(), mock_env(), info, msg)
            .expect("contract successfully handles UpdateCredentialMerkeRoot message");

        // Generate proofs for the dummy credential
        let proofs = merkle_tree.generate_proof(&String::from("credential2")).unwrap();
        let mut merkle_proofs = LinkedList::new();
        for proof in proofs.clone() {
            merkle_proofs.push_back(proof);
        }

        // let res_offchain = merkle_tree.verify_proof(&"credential2".to_string(), proofs);
        // println!("RES OFF CHAIN: {:}", res_offchain);

        let query_msg = QueryMsg::VerifyCredential {
            did: String::from("alice_did"),
            credential_hash: String::from("credential2"),
            merkle_proofs: merkle_proofs.clone(),
        };
        let res = query(deps.as_ref(), mock_env(), query_msg).unwrap();
        let value: bool = from_json(&res).unwrap();

        assert!(value, "Expected verification to succeed with correct proofs for dummy credential");

        // Negative case: Verify a non-existent credential
        let non_existent_leaf = String::from("non_existent_credential_hash");
        let query_msg = QueryMsg::VerifyCredential {
            did: String::from("alice_did"),
            credential_hash: non_existent_leaf,
            merkle_proofs,
        };
        let res = query(deps.as_ref(), mock_env(), query_msg).unwrap();
        let value_fail: bool = from_json(&res).unwrap();
        assert!(!value_fail, "Expected verification to fail with wrong proofs for a credential");
    }
}
