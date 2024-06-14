#[cfg(test)]
mod tests {
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coin, coins, from_binary, Addr, Coin};
    use std::collections::LinkedList;
    use crate::contract::{execute, instantiate, query};
    use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
    use crate::state::Config;
    use crate::tests::common::common::{assert_config_state, mock_init_no_price};

    #[test]
    fn set_subscription_price() {
        let mut deps = mock_dependencies();

        mock_init_no_price(deps.as_mut());

        let info = mock_info("alice_key", &[]);
        let price = coin(10, "core");
        let msg = ExecuteMsg::SetSubscriptionPrice {
            price: price.clone(),
        };

        let _res = execute(deps.as_mut(), mock_env(), info, msg)
            .expect("contract successfully handles SetSubscriptionPrice message");

        let stored_price = crate::state::subscription_price_storage_read(&deps.storage)
            .may_load("alice_key".as_bytes())
            .expect("load subscription price")
            .unwrap();

        assert_eq!(stored_price, price);
    }

    #[test]
    fn subscribe_success() {
        let mut deps = mock_dependencies();

        mock_init_no_price(deps.as_mut());

        let info = mock_info("alice_key", &[]);
        let price = coin(10, "core");
        let set_price_msg = ExecuteMsg::SetSubscriptionPrice {
            price: price.clone(),
        };
        let _res = execute(deps.as_mut(), mock_env(), info.clone(), set_price_msg)
            .expect("contract successfully handles SetSubscriptionPrice message");

        let subscribe_info = mock_info("bob_key", &coins(10, "core"));
        let subscribe_msg = ExecuteMsg::Subscribe {
            did: "alice_key".to_string(),
        };

        let _res = execute(deps.as_mut(), mock_env(), subscribe_info, subscribe_msg)
            .expect("contract successfully handles Subscribe message");

        let is_subscriber_msg = QueryMsg::IsSubscriber {
            did: "alice_key".to_string(),
            subscriber: "bob_key".to_string(),
        };

        let res = query(deps.as_ref(), mock_env(), is_subscriber_msg).unwrap();
        let value: bool = from_binary(&res).unwrap();
        assert!(value, "Expected bob_key to be a subscriber of alice_key");
    }

    #[test]
    fn subscribe_insufficient_funds() {
        let mut deps = mock_dependencies();

        mock_init_no_price(deps.as_mut());

        let info = mock_info("alice_key", &[]);
        let price = coin(10, "core");
        let set_price_msg = ExecuteMsg::SetSubscriptionPrice {
            price: price.clone(),
        };
        let _res = execute(deps.as_mut(), mock_env(), info.clone(), set_price_msg)
            .expect("contract successfully handles SetSubscriptionPrice message");

        let subscribe_info = mock_info("bob_key", &coins(5, "core"));
        let subscribe_msg = ExecuteMsg::Subscribe {
            did: "alice_key".to_string(),
        };

        let res = execute(deps.as_mut(), mock_env(), subscribe_info, subscribe_msg);

        assert!(res.is_err(), "Expected subscribe call to fail with insufficient funds");
    }

    #[test]
    fn subscribe_excess_funds() {
        let mut deps = mock_dependencies();

        mock_init_no_price(deps.as_mut());

        let info = mock_info("alice_key", &[]);
        let price = coin(10, "core");
        let set_price_msg = ExecuteMsg::SetSubscriptionPrice {
            price: price.clone(),
        };
        let _res = execute(deps.as_mut(), mock_env(), info.clone(), set_price_msg)
            .expect("contract successfully handles SetSubscriptionPrice message");

        let subscribe_info = mock_info("bob_key", &coins(15, "core"));
        let subscribe_msg = ExecuteMsg::Subscribe {
            did: "alice_key".to_string(),
        };

        let res = execute(deps.as_mut(), mock_env(), subscribe_info.clone(), subscribe_msg)
            .expect("contract successfully handles Subscribe message");

        let attributes = res.attributes;
        let refund_attribute = attributes.iter().find(|&attr| attr.key == "refund").unwrap();
        assert_eq!(refund_attribute.value, "5core", "Expected refund of 5 core");

        let is_subscriber_msg = QueryMsg::IsSubscriber {
            did: "alice_key".to_string(),
            subscriber: "bob_key".to_string(),
        };

        let res = query(deps.as_ref(), mock_env(), is_subscriber_msg).unwrap();
        let value: bool = from_binary(&res).unwrap();
        assert!(value, "Expected bob_key to be a subscriber of alice_key");
    }

    #[test]
    fn subscribe_nonexistent_did() {
        let mut deps = mock_dependencies();

        mock_init_no_price(deps.as_mut());

        let subscribe_info = mock_info("bob_key", &coins(10, "core"));
        let subscribe_msg = ExecuteMsg::Subscribe {
            did: "nonexistent_did".to_string(),
        };

        let res = execute(deps.as_mut(), mock_env(), subscribe_info, subscribe_msg);

        assert!(res.is_err(), "Expected subscribe call to fail for nonexistent DID");
    }
}
