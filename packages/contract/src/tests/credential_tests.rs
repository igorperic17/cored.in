#[cfg(test)]
mod tests {
    use crate::contract::{execute, query};
    use crate::msg::{ExecuteMsg, GetMerkleRootResponse, QueryMsg};
    use crate::tests::common::common::{mock_alice_registers_name, mock_init_no_price};
    // use crate::tests::common::common::{mock_alice_registers_name, mock_init_no_price};
    use cosmwasm_std::from_json;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use hex;
    use std::collections::LinkedList;

    use crate::merkle_tree::MerkleTree;

    #[test]
    fn test_static_verify() {
        // Sample values generated from cored.in backend
        let root = "343b781460b1484625b8dc47d69d8af0d9fe2eb5a6dc4aea114b50aa8d204a64".to_string();
        let leaf = "5b88eec706f39fec172b7328f57839dcdeec893bfda5e763e55a424c28022642".to_string();
        let proof = vec![
            "57b62ddde8cc706659e5c1db6c2d5096fac49e477e8bf9f5992967c6cb305acd".to_string(),
            "e4962589fd26724a71cb7609475e7260b8e92e55fb33753369ef0c964ecee50d".to_string(),
            "ad358cb5c113b643d6c452791d03a62db1589b49f9f8920e18a32e72e7aa81a4".to_string(),
        ];

        let res = MerkleTree::verify_proof_for_root(&root, &leaf, proof);
        assert!(res, "Invalid proof");
    }

    #[test]
    fn test_merkle_tree_logic() {
        // Random set of credentials
        let credentials = vec![
            "urn:uuid:73740255-eded-46dc-88f9-830ba0971b16".to_string(),
            "urn:uuid:a332dac8-b5e3-4f00-8ed6-e32ea5077f0e".to_string(),
            "urn:uuid:8be48d9f-70c9-4ffa-8379-b3e68772e7cc".to_string(),
            "urn:uuid:f242fa1b-ea51-4e35-8c85-4588abed0491".to_string(),
            "urn:uuid:c9a4033b-1aa6-450e-bc66-725acfae7b88".to_string(),
        ];

        // Create a new Merkle tree from credentials
        let mut merkle_tree = MerkleTree::new();
        for cred in credentials {
            merkle_tree.add_credential(cred.to_string());
        }

        // Pick a credential and generate proofs for it
        let target_credential = "urn:uuid:73740255-eded-46dc-88f9-830ba0971b16".to_string();
        let proofs = merkle_tree.generate_proof(&target_credential).unwrap();

        // Verify the root using the generated proofs
        let target_credential_hashed = MerkleTree::hash(hex::encode(target_credential).as_ref());
        let verification_result =
            merkle_tree.verify_proof(&target_credential_hashed, proofs.clone());

        // Check if the verification result matches the original root
        assert!(verification_result, "Merkle root verification failed");

        // Negative case: Verify a non-existent credential
        let non_existent_credential =
            MerkleTree::hash(hex::encode("non_existent_credential").as_ref());
        let non_existent_verification_result =
            merkle_tree.verify_proof(&non_existent_credential, proofs);

        // The verification result should not match the original root
        assert!(
            !non_existent_verification_result,
            "Non-existent credential verification should fail"
        );
    }

    // #[test]
    // fn test_verify() {
    //     let mut deps = mock_dependencies();

    //     mock_init_no_price(deps.as_mut());

    //     mock_alice_registers_name(deps.as_mut(), &[]);

    //     let info = mock_info("alice_key", &[]);

    //     // Sample values generated from cored.in backend
    //     let root = "343b781460b1484625b8dc47d69d8af0d9fe2eb5a6dc4aea114b50aa8d204a64".to_string();
    //     let leaf = "5b88eec706f39fec172b7328f57839dcdeec893bfda5e763e55a424c28022642".to_string();
    //     let proof = vec![
    //         "57b62ddde8cc706659e5c1db6c2d5096fac49e477e8bf9f5992967c6cb305acd".to_string(),
    //         "e4962589fd26724a71cb7609475e7260b8e92e55fb33753369ef0c964ecee50d".to_string(),
    //         "ad358cb5c113b643d6c452791d03a62db1589b49f9f8920e18a32e72e7aa81a4".to_string(),
    //     ];

    //     let msg = ExecuteMsg::UpdateCredentialMerkleRoot {
    //         did: "alice_did".to_string(),
    //         root: root.clone(),
    //     };
    //     let _res = execute(deps.as_mut(), mock_env(), info, msg)
    //         .expect("contract successfully handles UpdateCredentialMerkeRoot message");

    //     let query_root_msg = QueryMsg::GetMerkleRoot {
    //         did: "alice_did".to_string(),
    //     };
    //     let query_root_res = query(deps.as_ref(), mock_env(), query_root_msg).unwrap();
    //     let query_root_value: GetMerkleRootResponse = from_json(&query_root_res).unwrap();
    //     assert!(
    //         query_root_value.root == Some(root),
    //         "Expected onchain root to match"
    //     );

    //     let linked_proof: LinkedList<String> = proof.iter().map(|x| x.to_string()).collect();
    //     let query_msg = QueryMsg::VerifyCredential {
    //         did: "alice_did".to_string(),
    //         credential_hash: leaf,
    //         merkle_proofs: linked_proof.clone(),
    //     };
    //     let res = query(deps.as_ref(), mock_env(), query_msg).unwrap();
    //     let value: bool = from_json(&res).unwrap();

    //     assert!(
    //         value,
    //         "Expected verification to succeed with correct proofs for dummy credential"
    //     );
    // }

    // #[test]
    // fn test_store_and_verify_dummy_credentials() {
        
    //     let mut deps = mock_dependencies();

    //     mock_init_no_price(deps.as_mut());
    //     mock_alice_registers_name(deps.as_mut(), &[]);

    //     // Update VC root with dummy credentials
    //     let info: cosmwasm_std::MessageInfo = mock_info("alice_key", &[]);
    //     let credentials = vec![
    //         "urn:uuid:73740255-eded-46dc-88f9-830ba0971b16".to_string(),
    //         "urn:uuid:a332dac8-b5e3-4f00-8ed6-e32ea5077f0e".to_string(),
    //         "urn:uuid:8be48d9f-70c9-4ffa-8379-b3e68772e7cc".to_string(),
    //         "urn:uuid:f242fa1b-ea51-4e35-8c85-4588abed0491".to_string(),
    //         "urn:uuid:c9a4033b-1aa6-450e-bc66-725acfae7b88".to_string(),
    //     ];

    //     // Create a new Merkle tree from credentials
    //     let mut merkle_tree = MerkleTree::new();
    //     for cred in credentials.clone() {
    //         merkle_tree.add_credential(cred);
    //     }
    //     let root = merkle_tree.get_root();

    //     let target_credential = credentials[0].to_string();
    //     let msg = ExecuteMsg::UpdateCredentialMerkleRoot {
    //         did: String::from("alice_did"),
    //         root: root.clone(),
    //     };
    //     let _res = execute(deps.as_mut(), mock_env(), info, msg)
    //         .expect("contract successfully handles UpdateCredentialMerkeRoot message");

    //     // Generate proofs for the dummy credential
    //     let proofs = merkle_tree.generate_proof(&target_credential).unwrap();
    //     let mut merkle_proofs = LinkedList::new();
    //     for proof in proofs.clone() {
    //         merkle_proofs.push_back(proof);
    //     }

    //     let query_msg = QueryMsg::VerifyCredential {
    //         did: String::from("alice_did"),
    //         credential_hash: MerkleTree::hash(hex::encode(target_credential).as_str()),
    //         merkle_proofs: merkle_proofs.clone(),
    //     };
    //     let res = query(deps.as_ref(), mock_env(), query_msg).unwrap();
    //     let value: bool = from_json(&res).unwrap();

    //     assert!(
    //         value,
    //         "Expected verification to succeed with correct proofs for dummy credential"
    //     );

    //     // Negative case: Verify a non-existent credential
    //     let non_existent_leaf = "non_existent_credential_hash".to_string();
    //     let query_msg = QueryMsg::VerifyCredential {
    //         did: String::from("alice_did"),
    //         credential_hash: MerkleTree::hash(hex::encode(non_existent_leaf).as_str()),
    //         merkle_proofs,
    //     };
    //     let res = query(deps.as_ref(), mock_env(), query_msg).unwrap();
    //     let value_fail: bool = from_json(&res).unwrap();
    //     assert!(
    //         !value_fail,
    //         "Expected verification to fail with wrong proofs for a credential"
    //     );
    // }
}
