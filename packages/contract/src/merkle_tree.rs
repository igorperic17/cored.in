extern crate sha3;

use sha3::{Digest, Keccak256};

pub struct MerkleTree {
    credentials: Vec<String>,
    root: String,
}

impl MerkleTree {
    // Create a new MerkleTree
    pub fn new() -> MerkleTree {
        MerkleTree {
            credentials: Vec::new(),
            root: String::new(),
        }
    }

    // Helper function to hash a hex encoded string using Keccak256
    pub fn hash(data: &str) -> String {
        let mut hasher = Keccak256::new();
        let decoded = hex::decode(data).expect("Decoding failed");
        hasher.update(decoded);
        format!("{:x}", hasher.finalize())
    }

    // // Helper function to hash a hex encoded string using Keccak256
    // pub fn hash(data: &str) -> String {
    //     return data.to_string()
    // }

    // Add a credential to the Merkle tree
    pub fn add_credential(&mut self, raw_credential: String) {
        let encoded = hex::encode(raw_credential);
        self.credentials.push(Self::hash(&encoded.to_string()));
        self.root = self.compute_root();
    }

    // Compute the Merkle root of the tree
    fn compute_root(&self) -> String {
        let mut hashes: Vec<String> = self.credentials.clone();

        while hashes.len() > 1 {
            hashes = self.pair_hashes(hashes);
        }

        hashes.first().cloned().unwrap_or_default()
    }

    // Helper function to pair hashes
    fn pair_hashes(&self, hashes: Vec<String>) -> Vec<String> {
        let mut paired_hashes = Vec::new();
        let mut i = 0;

        while i < hashes.len() {
            let left = &hashes[i];
            let right = if i + 1 < hashes.len() { Some(&hashes[i + 1]) } else { None };
            match right {
                Some(right_val) => {
                    if left < right_val {
                        paired_hashes.push(Self::hash(&(left.clone() + right_val))); 
                    } else {
                        paired_hashes.push(Self::hash(&(right_val.clone() + &left))); 
                    }
                }
                None => { paired_hashes.push(left.clone()); }
            }
            i += 2;
        }

        // paired_hashes.reverse();
        paired_hashes
    }

    // Get the Merkle root
    pub fn get_root(&self) -> String {
        self.root.clone()
    }
    // Generate proof for a given credential (not hashed)
    pub fn generate_proof(&self, raw_credential: &String) -> Option<Vec<String>> {
        let hashed_credential = Self::hash(hex::encode(raw_credential).as_ref());
        // let hashed_credential = Self::hash(raw_credential.as_ref());

        let mut index = self.credentials.iter().position(|x| *x == hashed_credential)?;

        let mut proof = Vec::new();
        let mut level_hashes: Vec<String> = self.credentials.clone();

        while level_hashes.len() > 1 {
            let sibling_index = if index % 2 == 0 { index + 1 } else { index - 1 };
            if sibling_index < level_hashes.len() {
                proof.push(level_hashes[sibling_index].clone());
            }

            index /= 2;
            level_hashes = self.pair_hashes(level_hashes);
        }

        // proof.reverse();  // Reverse the order of the proof
        Some(proof)
    }

    // Verify a proof for a given credential and a root (static method)
    pub fn verify_proof_for_root(root: &String, leaf: &String, proof: Vec<String>) -> bool {
        let mut current_hash = leaf.clone();
        for sibling_hash in proof {
            if current_hash <= sibling_hash {
                current_hash = Self::hash(&(current_hash + &sibling_hash));
            } else {
                current_hash = Self::hash(&(sibling_hash + &current_hash));
            }
        }
        println!("Computed root form proofs: {}", current_hash);
        current_hash == *root
    }

    // Verify a proof for a given credential and locally stored credentials
    pub fn verify_proof(&self, leaf: &String, proof: Vec<String>) -> bool {
        Self::verify_proof_for_root(&self.root, leaf, proof)
    }
}
