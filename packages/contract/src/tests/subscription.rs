#[cfg(test)]
mod tests {
    use coreum_wasm_sdk::assetft::BalanceResponse;
    use coreum_wasm_sdk::core::{CoreumMsg, CoreumQueries};
    use coreum_wasm_sdk::types::coreum;
    use coreum_wasm_sdk::types::coreum::asset::ft;
    use coreum_wasm_sdk::types::coreum::asset::ft::v1::QueryBalanceResponse;
    use coreum_wasm_sdk::types::cosmos::bank::v1beta1::QueryBalanceRequest;
    use cosmwasm_schema::QueryResponses;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coin, coins, from_json, BankMsg, CosmosMsg, QueryRequest};
    use crate::contract::{execute, query};
    use crate::msg::{ExecuteMsg, QueryMsg};
    use crate::tests::common::common::{get_deps, mock_init_no_price, mock_register};

    #[test]
    fn set_subscription_price() {
        let mut deps_empty = mock_dependencies();
        let deps = get_deps(&mut deps_empty);

        mock_init_no_price(deps);

        // register actors
        let deps = get_deps(&mut deps_empty);
        mock_register(deps, "alice", &[coin(10, "core")]);

        let info = mock_info("alice_key", &[]);
        let price = coin(10, "core");
        let msg = ExecuteMsg::SetSubscriptionPrice {
            price: price.clone(),
        };

        let deps = get_deps(&mut deps_empty);
        let _res = execute(deps, mock_env(), info, msg)
            .expect("contract successfully handles SetSubscriptionPrice message");

        let deps = get_deps(&mut deps_empty);
        let stored_price = crate::state::profile_storage_read(deps.storage)
            .may_load("alice_did".as_bytes())
            .expect("load subscription price")
            .unwrap().subscription_price.unwrap();

        assert_eq!(stored_price, price);
    }

    #[test]
    fn subscribe_success() {
        let mut deps_empty = mock_dependencies();
        let deps = get_deps(&mut deps_empty);

        mock_init_no_price(deps);

        // register actors
        let deps = get_deps(&mut deps_empty);
        mock_register(deps, "alice", &[coin(10, "core")]);
        let deps = get_deps(&mut deps_empty);
        mock_register(deps, "bob", &[coin(10, "core")]);

        let subscribe_info = mock_info("bob_key", &coins(10, "core"));
        let subscribe_msg = ExecuteMsg::Subscribe {
            did: "alice_did".to_string(),
        };

        let deps = get_deps(&mut deps_empty);
        let _res = execute(deps, mock_env(), subscribe_info, subscribe_msg)
            .expect("contract successfully handles Subscribe message");

        let is_subscriber_msg = QueryMsg::IsSubscriber {
            did: "alice_did".to_string(),
            subscriber: "bob_did".to_string(),
        };

        let deps = get_deps(&mut deps_empty);
        let res = query(deps.as_ref(), mock_env(), is_subscriber_msg).unwrap();
        let value: bool = from_json(&res).unwrap();
        assert!(value, "Expected Bob to be a subscriber of Alice");
    }

    #[test]
    fn subscribe_insufficient_funds() {
        let mut deps_empty = mock_dependencies();
        let deps = get_deps(&mut deps_empty);
        
        mock_init_no_price(deps);

        // register actors
        let deps = get_deps(&mut deps_empty);
        mock_register(deps, "alice", &[coin(10, "core")]);
        let deps = get_deps(&mut deps_empty);
        mock_register(deps, "bob", &[coin(10, "core")]);

        let info = mock_info("alice_key", &[]);
        let price = coin(10, "core");
        let set_price_msg = ExecuteMsg::SetSubscriptionPrice {
            price: price.clone(),
        };
        let deps = get_deps(&mut deps_empty);
        let _res = execute(deps, mock_env(), info.clone(), set_price_msg)
            .expect("contract successfully handles SetSubscriptionPrice message");

        let subscribe_info = mock_info("bob_key", &coins(5, "core"));
        let subscribe_msg = ExecuteMsg::Subscribe {
            did: "alice_key".to_string(),
        };

        let deps = get_deps(&mut deps_empty);
        let res = execute(deps, mock_env(), subscribe_info, subscribe_msg);

        assert!(res.is_err(), "Expected subscribe call to fail with insufficient funds");
    }

    #[test]
    fn subscribe_excess_funds() {
        let mut deps_empty = mock_dependencies();
        let deps = get_deps(&mut deps_empty);

        mock_init_no_price(deps);

        // register actors
        let deps = get_deps(&mut deps_empty);
        mock_register(deps, "alice", &[coin(100, "core")]);
        let deps = get_deps(&mut deps_empty);
        mock_register(deps, "bob", &[coin(100, "core")]);
        let deps = get_deps(&mut deps_empty);
        mock_register(deps, "claire", &[coin(100, "core")]);

        // Alice sets her sub price to 10 CORE tokens
        //  1st subscriber pays 1 * 10 CORE = 10 CORE
        //  2nd subscriber pays 2 * 10 CORE = 20 CORE
        //  ... 
        let info = mock_info("alice_key", &[]);
        let price = coin(10, "core");
        let set_price_msg = ExecuteMsg::SetSubscriptionPrice {
            price: price.clone(),
        };

        let deps = get_deps(&mut deps_empty);
        let _res = execute(deps, mock_env(), info.clone(), set_price_msg)
            .expect("contract successfully handles SetSubscriptionPrice message");

        // Bob wants to sub to Alice, which should cost him 10 CORE, but he attaches 15 CORE to the transaction...
        let subscribe_info = mock_info("bob_key", &coins(15, "core"));
        let subscribe_msg = ExecuteMsg::Subscribe {
            did: "alice_did".to_string(),
        };
        let deps = get_deps(&mut deps_empty);
        let res = execute(deps, mock_env(), subscribe_info.clone(), subscribe_msg.clone())
            .expect("contract successfully handles Subscribe message");

        // .. and he gets 5 CORE refunded 
        let attributes = res.attributes;
        let refund_attribute = attributes.iter().find(|&attr| attr.key == "refund").unwrap();
        assert_eq!(refund_attribute.value, "5core", "Expected refund of 5 core");

        // confirm Bob is a subscriber of Alice...
        let is_bob_subscriber_msg = QueryMsg::IsSubscriber {
            did: "alice_did".to_string(),
            subscriber: "bob_did".to_string(),
        };
        let deps = get_deps(&mut deps_empty);
        let res = query(deps.as_ref(), mock_env(), is_bob_subscriber_msg).unwrap();
        let value: bool = from_json(&res).unwrap();
        assert!(value, "Expected Bob to be a subscriber of Alice");

        // ... and Claire isn't
        let is_claire_subscriber_msg = QueryMsg::IsSubscriber {
            did: "alice_did".to_string(),
            subscriber: "claire_did".to_string(),
        };
        let res = query(deps.as_ref(), mock_env(), is_claire_subscriber_msg.clone()).unwrap();
        let value: bool = from_json(&res).unwrap();
        assert!(value == false, "Expected Claire not to be a subscriber of Alice at this moment");

        // Claire tries to subscribe to Alice by attaching 15 CORE, less than needed 
        // since Alice already has 1 subscriber so the price is 20 CORE
        let claire_subscribe_info = mock_info("claire_key", &coins(15, "core"));
        let deps = get_deps(&mut deps_empty);
        let _ = execute(deps, mock_env(), claire_subscribe_info.clone(), subscribe_msg.clone())
            .expect_err("contract successfully handles Subscribe message");
        
            let deps = get_deps(&mut deps_empty);
        let res = query(deps.as_ref(), mock_env(), is_claire_subscriber_msg.clone()).unwrap();
        let value: bool = from_json(&res).unwrap();
        assert!(value == false, "Expected Claire not to be a subscriber of Alice at this moment");

        // Claire tries to subscribe to Alice by attaching 55 CORE, more than needed
        let claire_subscribe_info = mock_info("claire_key", &coins(55, "core"));
        let deps = get_deps(&mut deps_empty);
        let claire_sub_res = execute(deps, mock_env(), claire_subscribe_info.clone(), subscribe_msg.clone())
            .expect("contract successfully handles Subscribe message");
        
            let deps = get_deps(&mut deps_empty);
        let res = query(deps.as_ref(), mock_env(), is_claire_subscriber_msg).unwrap();
        let value: bool = from_json(&res).unwrap();
        assert!(value, "Expected Claire to be a subscriber of Alice at this moment");

        // She should get 55 - 20 = 35 CORE as a refund
        let attributes = claire_sub_res.attributes;
        let refund_attribute = attributes.iter().find(|&attr| attr.key == "refund").unwrap();
        assert_eq!(refund_attribute.value, "35core", "Expected refund of 35 core");

    }

    #[test]
    fn subscribe_nonexistent_did() {
        let mut deps_empty = mock_dependencies();

        let deps = get_deps(&mut deps_empty);
        mock_init_no_price(deps);
        // register actors
        let deps = get_deps(&mut deps_empty);
        mock_register(deps, "bob", &[coin(10, "core")]);

        let subscribe_info = mock_info("bob_key", &coins(10, "core"));
        let subscribe_msg = ExecuteMsg::Subscribe {
            did: "nonexistent_did".to_string(),
        };

        let deps = get_deps(&mut deps_empty);
        let res = execute(deps, mock_env(), subscribe_info, subscribe_msg);

        assert!(res.is_err(), "Expected subscribe call to fail for nonexistent DID");
    }

    #[test]
    fn subscribe_nft_issued() {
        let mut deps_empty = mock_dependencies();

        let deps = get_deps(&mut deps_empty);
        mock_init_no_price(deps);
        // register actors
        let deps = get_deps(&mut deps_empty);
        mock_register(deps, "alice", &[coin(10, "core")]);
        let deps = get_deps(&mut deps_empty);
        mock_register(deps, "bob", &[coin(10, "core")]);

        let subscribe_info = mock_info("bob_key", &coins(10, "core"));
        let subscribe_msg = ExecuteMsg::Subscribe {
            did: "alice_did".to_string(),
        };

        // // get all NFTs for Bob and see if he's got one NFT from Alice's collection
        // let get_nft_message = assetnft::Query::Class { id: "alice_did".to_string() };
        
        // // TODO: change this to {contract_address}-{profile_did}
        // // issues NFTs will have IDs of the form {contract_address}-{profile_did}-{subscriber_did}
        // let class_id = format!(
        //     "{}-{}",
        //     "alice_did".to_string(),
        //     "alice_did".to_string()
        //     // target_address[..26].to_string(),
        //     // env.contract.address
        // );
        // let nft_id = format!("{}-{}", class_id, "bob_did");
        // let request: QueryRequest<CoreumQueries> =
        //     CoreumQueries::NFT(nft::Query::NFT { class_id, nft_id }).into();
        // let res: Option<nft::NFTResponse> = deps.querier.raw_query(&request);
        
        // // https://github.com/CoreumFoundation/coreum-wasm-sdk/blob/main/src/nft.rs


        // // // // TODO: change this
        // // match res {
        // //     Some(nft) => to_binary(&true),
        // //     None => to_binary(&false),
        // // }

        let deps = get_deps(&mut deps_empty);
        let res = execute(deps, mock_env(), subscribe_info.clone(), subscribe_msg.clone());
        assert!(res.is_ok(), "Expected subscribe call to suceed");

        // repeated subscription should pass
        let deps = get_deps(&mut deps_empty);
        let res = execute(deps, mock_env(), subscribe_info, subscribe_msg);
        assert!(res.is_ok(), "Expected subscribe call to suceed");

    }


    #[test]
    fn subscribe_payout_owner() {
        let mut deps_empty = mock_dependencies();

        let deps = get_deps(&mut deps_empty);
        mock_init_no_price(deps);
        // register actors
        let deps = get_deps(&mut deps_empty);
        mock_register(deps, "alice", &[coin(10, "core")]);
        let deps = get_deps(&mut deps_empty);
        mock_register(deps, "bob", &[coin(10, "core")]);

        let subscribe_info = mock_info("bob_key", &coins(10, "core"));
        let subscribe_msg = ExecuteMsg::Subscribe {
            did: "alice_did".to_string(),
        };

        let deps = get_deps(&mut deps_empty);
        let res = execute(deps, mock_env(), subscribe_info, subscribe_msg);

        assert!(res.is_ok(), "Expected subscribe call to suceed");

        // check if Alice got paid
        // let balance_request = cosmwasm_std::BankQuery::Balance { 
        //     address:  "alice_key".to_string(),
        //     denom: "core".to_string(),
        // };
        let balance_request = coreum::asset::ft::v1::QueryBalanceRequest {
            account:  "alice_key".to_string(),
            denom: "core".to_string(),
        };
        let q: QueryRequest<CoreumQueries> = balance_request.into();
        let deps = get_deps(&mut deps_empty);
        let balance_response = deps.querier.query::<coreum::asset::ft::v1::QueryBalanceResponse>(&q);
        println!("{:?}", balance_response);
        // assert!(balance_response.balance == "8core");
    }

}
