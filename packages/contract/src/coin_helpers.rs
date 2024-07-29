use crate::{error::ContractError, subscription::hash_did};
use cosmwasm_std::{Coin, Env};

pub fn generate_nft_class_id(env: Env, subscribe_to_did: String) -> String {
    // issued NFTs will have IDs of the form {contract_address}-{profile_did}-{subscriber_did}
    let class_id = format!(
        "{}-{}",
        env.contract.address.to_string(),
        hash_did(subscribe_to_did.as_str(), 26)
    );
    class_id
}

pub fn generate_nft_id(env: Env, subscriber_did: String, subscribe_to_did: String) -> String {
    // issued NFTs will have IDs of the form {contract_address}-{profile_did}-{subscriber_did}
    let class_id = format!(
        "{}-{}",
        env.contract.address.to_string(),
        hash_did(subscribe_to_did.as_str(), 26)
    );
    let nft_id = format!(
        "{}-{}",
        class_id,
        hash_did(subscriber_did.as_str(), 26)
    );
    nft_id
}

pub fn assert_sent_sufficient_coin(
    sent: &[Coin],
    required: Option<Coin>,
) -> Result<(), ContractError> {
    if let Some(required_coin) = required {
        let required_amount = required_coin.amount.u128();
        if required_amount > 0 {
            let required_sent = sent.iter().find(|x| { x.denom == required_coin.denom });
            match required_sent {
                None => { return Err(ContractError::InsufficientFundsSend { sent: required_sent.cloned(), expected: Some(required_coin.clone()) } ) },
                Some(x) => {
                    if x.amount < required_coin.amount {
                        return Err(ContractError::InsufficientFundsSend { sent: required_sent.cloned(), expected: Some(required_coin.clone()) } )
                    }
                }
            }
        }
    }
    
    Ok(())
}

#[cfg(test)]
mod test {
    use super::*;
    use cosmwasm_std::{coin, coins};

    #[test]
    fn assert_sent_sufficient_coin_works() {
        match assert_sent_sufficient_coin(&[], Some(coin(0, "token"))) {
            Ok(()) => {}
            Err(e) => panic!("Unexpected error: {:?}", e),
        };

        match assert_sent_sufficient_coin(&[], Some(coin(5, "token"))) {
            Ok(()) => panic!("Should have raised insufficient funds error"),
            Err(ContractError::InsufficientFundsSend { sent: _, expected: _  }) => {}
            Err(e) => panic!("Unexpected error: {:?}", e),
        };

        match assert_sent_sufficient_coin(&coins(10, "smokin"), Some(coin(5, "token"))) {
            Ok(()) => panic!("Should have raised insufficient funds error"),
            Err(ContractError::InsufficientFundsSend { sent: _, expected: _ }) => {}
            Err(e) => panic!("Unexpected error: {:?}", e),
        };

        match assert_sent_sufficient_coin(&coins(10, "token"), Some(coin(5, "token"))) {
            Ok(()) => {}
            Err(e) => panic!("Unexpected error: {:?}", e),
        };

        let sent_coins = vec![coin(2, "smokin"), coin(5, "token"), coin(1, "earth")];
        match assert_sent_sufficient_coin(&sent_coins, Some(coin(5, "token"))) {
            Ok(()) => {}
            Err(e) => panic!("Unexpected error: {:?}", e),
        };
    }
}
