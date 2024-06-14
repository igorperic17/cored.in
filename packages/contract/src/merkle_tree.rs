extern crate sha2;

use sha2::{Sha256, Digest};

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

    // Helper function to hash a string using SHA-256
    fn hash(data: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(data);
        format!("{:x}", hasher.finalize())
    }

    // Add a credential to the Merkle tree
    pub fn add_credential(&mut self, credential: String) {
        self.credentials.push(credential);
        self.root = self.compute_root();
    }

    // Compute the Merkle root of the tree
    fn compute_root(&self) -> String {
        let mut hashes: Vec<String> = self.credentials.iter().map(|cred| Self::hash(cred)).collect();

        while hashes.len() > 1 {
            hashes = self.pair_hashes(hashes);
        }

        hashes.first().cloned().unwrap_or_default()
    }

    // Helper function to pair hashes
    fn pair_hashes(&self, mut hashes: Vec<String>) -> Vec<String> {
        if hashes.len() % 2 != 0 {
            hashes.push(hashes.last().unwrap().clone());
        }

        let mut paired_hashes = Vec::new();
        let mut i = 0;

        while i < hashes.len() {
            let left = &hashes[i];
            let right = &hashes[i + 1];
            paired_hashes.push(Self::hash(&(left.clone() + right)));
            i += 2;
        }

        paired_hashes
    }

    // Get the Merkle root
    pub fn get_root(&self) -> String {
        self.root.clone()
    }

    // Generate proof for a given credential
    pub fn generate_proof(&self, credential: &String) -> Option<Vec<String>> {
        let mut index = self.credentials.iter().position(|x| x == credential)?;
        

        let mut proof = Vec::new();
        let mut level_hashes: Vec<String> = self.credentials.iter().map(|cred| Self::hash(cred)).collect();

        while level_hashes.len() > 1 {
            // println!("AAAAAAA");
            if level_hashes.len() % 2 != 0 {
                level_hashes.push(level_hashes.last().unwrap().clone());
            }

            let sibling_index = if index % 2 == 0 { index + 1 } else { index - 1 };
            if sibling_index < level_hashes.len() {
                proof.push(level_hashes[sibling_index].clone());
            }

            index /= 2;
            level_hashes = self.pair_hashes(level_hashes);
        }

        Some(proof)
    }

    // Verify a proof for a given credential and a root (static method)
    pub fn verify_proof_for_root(root: &String, credential: &String, proof: Vec<String>) -> bool {
        let mut current_hash = Self::hash(credential);

        for sibling_hash in proof {
            if current_hash <= sibling_hash {
                current_hash = Self::hash(&(current_hash + &sibling_hash));
            } else {
                current_hash = Self::hash(&(sibling_hash + &current_hash));
            }
        }

        current_hash == *root
    }

    // Verify a proof for a given credential and locally stored credentials
    pub fn verify_proof(&self, credential: &String, proof: Vec<String>) -> bool {
        Self::verify_proof_for_root(&self.root, credential, proof)
    }
}