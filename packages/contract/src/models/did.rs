use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

// wrapper for a DID to ensure proper format
// used in conjuction with Addr for easier distinguishing and more robust code
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema, Eq)]
pub struct DID {
    value: String,
}

impl DID {
    pub fn new(value: String) -> Result<Self, &'static str> {
        // Basic DID format validation
        // DID should start with "did:" followed by a method and a method-specific identifier
        if !value.starts_with("did:") {
            return Err("DID must start with 'did:'");
        }

        let parts: Vec<&str> = value.split(':').collect();
        if parts.len() < 3 {
            return Err(
                "DID must have at least three parts: 'did', method, and method-specific identifier",
            );
        }

        // Check if the method is not empty
        if parts[1].is_empty() {
            return Err("DID method cannot be empty");
        }

        // Check if the method-specific identifier is not empty
        if parts[2].is_empty() {
            return Err("DID method-specific identifier cannot be empty");
        }

        // Additional checks can be added here for specific DID methods if needed

        Ok(DID { value })
    }

    pub fn value(&self) -> &str {
        &self.value
    }

    // New getter method to read the value from outside
    pub fn get_value(&self) -> &String {
        &self.value
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_valid_did() {
        let did = DID::new("did:example:123456789abcdefghi".to_string());
        assert!(did.is_ok());
    }

    #[test]
    fn test_invalid_did_format() {
        let did = DID::new("invalid:did:format".to_string());
        assert!(did.is_err());
    }

    #[test]
    fn test_missing_method() {
        let did = DID::new("did::123456789abcdefghi".to_string());
        assert!(did.is_err());
    }

    #[test]
    fn test_missing_identifier() {
        let did = DID::new("did:example:".to_string());
        assert!(did.is_err());
    }

    // New test for the getter method
    #[test]
    fn test_get_value() {
        let did = DID::new("did:example:123456789abcdefghi".to_string()).unwrap();
        assert_eq!(did.get_value(), "did:example:123456789abcdefghi");
    }
}
