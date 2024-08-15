#[cfg(test)]
mod tests {
    use hex;
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
}
