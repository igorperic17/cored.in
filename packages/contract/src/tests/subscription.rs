#[cfg(test)]
mod tests {
    use core::f32;
    use std::str::FromStr;

    use coreum_test_tube::cosmrs::tx::MessageExt;
    use coreum_test_tube::{Account, AssetNFT, Bank, CoreumTestApp, Module, SigningAccount, Wasm, NFT};
    use coreum_wasm_sdk::types::cosmos::bank::v1beta1::QueryBalanceRequest;
    use crate::contract::{execute, query, FEE_DENOM};
    use crate::msg::{ExecuteMsg, GetSubscriptionInfoResponse, InstantiateMsg, QueryMsg};
    use crate::tests::common::common::{get_balance, mock_register_account, with_test_tube};
    // use crate::tests::common::common::{mock_init_no_price, mock_register, mock_register_account, with_test_tube};
    use cosmwasm_std::testing::{
        mock_dependencies, mock_dependencies_with_balances, mock_env, mock_info,
    };
    use cosmwasm_std::{
        coin, coins, from_json, BalanceResponse, BankMsg, Binary, Coin, CosmosMsg, Decimal, QueryRequest, StdResult, Uint128, Uint64
    };
    
    use crate::tests::subscription::tests::QueryMsg::IsSubscriber;

    // #[test]
    // fn set_subscription() {
    //     let mut deps = mock_dependencies();

    //     mock_init_no_price(deps.as_mut());

    //     // register actors
    //     mock_register(deps.as_mut(), "alice", &[coin(10, "core")]);

    //     let info = mock_info("alice_key", &[]);
    //     let price = coin(10, "core");
    //     let duration = Uint64::from(30u64);
    //     let msg = ExecuteMsg::SetSubscription {
    //         price: price.clone(),
    //         duration: duration.clone(),
    //     };

    //     let _res = execute(deps.as_mut(), mock_env(), info, msg)
    //         .expect("contract successfully handles SetSubscription message");

    //     let profile = crate::state::profile_storage_read(deps.as_mut().storage)
    //         .may_load("alice_did".as_bytes())
    //         .expect("load subscription price")
    //         .unwrap();

    //     let stored_price = profile.subscription_price.unwrap();
    //     let stored_duration = profile.subscription_duration_days.unwrap();

    //     assert_eq!(stored_price, price);
    //     assert_eq!(stored_duration, duration);

    //     let get_duration_msg = QueryMsg::GetSubscriptionDuration {
    //         did: "alice_did".to_string(),
    //     };

    //     let res = query(deps.as_ref(), mock_env(), get_duration_msg).unwrap();
    //     let retrieved_duration: Uint64 = from_json(&res).unwrap();
    //     assert_eq!(retrieved_duration, duration);
    // }

    // #[test]
    // fn subscribe_success() {
    //     let env = mock_env();
    //     let mut deps = mock_dependencies();

    //     mock_init_no_price(deps.as_mut());

    //     // register actors
    //     mock_register(deps.as_mut(), "alice", &[coin(10, "core")]);
    //     mock_register(deps.as_mut(), "bob", &[coin(10, "core")]);

    //     let subscribe_info = mock_info("bob_key", &coins(10, "core"));
    //     let subscribe_msg = ExecuteMsg::Subscribe {
    //         did: "alice_did".to_string(),
    //     };

    //     let _res = execute(deps.as_mut(), mock_env(), subscribe_info, subscribe_msg)
    //         .expect("contract successfully handles Subscribe message");

    //     let is_subscriber_msg = QueryMsg::IsSubscriber {
    //         did: "alice_did".to_string(),
    //         subscriber: "bob_did".to_string(),
    //     };

    //     let res = query(deps.as_ref(), mock_env(), is_subscriber_msg).unwrap();
    //     let value: bool = from_json(&res).unwrap();
    //     assert!(value, "Expected Bob to be a subscriber of Alice");

    //     let sub_info_msg = QueryMsg::GetSubscriptionInfo {
    //         did: "alice_did".to_string(),
    //         subscriber: "bob_did".to_string(),
    //     };

    //     let read_res = query(deps.as_ref(), mock_env(), sub_info_msg).unwrap();
    //     let info: GetSubscriptionInfoResponse = from_json(&read_res).unwrap();
    //     let expected_end = env.block.time.plus_days(7);

    //     assert_eq!(
    //         info.info.unwrap().valid_until,
    //         expected_end,
    //         "Expected subscription to be valid for 7 days"
    //     );
    // }

    // #[test]
    // fn subscribe_insufficient_funds() {
    //     let mut deps = mock_dependencies();

    //     mock_init_no_price(deps.as_mut());

    //     // register actors
    //     mock_register(deps.as_mut(), "alice", &[coin(10, "core")]);
    //     mock_register(deps.as_mut(), "bob", &[coin(10, "core")]);

    //     let info = mock_info("alice_key", &[]);
    //     let price = coin(10, "core");
    //     let set_price_msg = ExecuteMsg::SetSubscription {
    //         price: price.clone(),
    //         duration: 30u64.into(),
    //     };
    //     let _res = execute(deps.as_mut(), mock_env(), info.clone(), set_price_msg)
    //         .expect("contract successfully handles SetSubscription message");

    //     let subscribe_info = mock_info("bob_key", &coins(5, "core"));
    //     let subscribe_msg = ExecuteMsg::Subscribe {
    //         did: "alice_key".to_string(),
    //     };

    //     let res = execute(deps.as_mut(), mock_env(), subscribe_info, subscribe_msg);

    //     assert!(
    //         res.is_err(),
    //         "Expected subscribe call to fail with insufficient funds"
    //     );
    // }

    // #[test]
    // fn subscribe_excess_funds() {
    //     let mut deps = mock_dependencies();
    //     let env = mock_env();

    //     mock_init_no_price(deps.as_mut());

    //     // register actors
    //     mock_register(deps.as_mut(), "alice", &[coin(100, FEE_DENOM)]);
    //     mock_register(deps.as_mut(), "bob", &[coin(100, FEE_DENOM)]);
    //     mock_register(deps.as_mut(), "claire", &[coin(100, FEE_DENOM)]);

    //     // Alice sets her sub price to 10 CORE tokens
    //     //  1st subscriber pays 1 * 10 CORE = 10 CORE
    //     //  2nd subscriber pays 2 * 10 CORE = 20 CORE
    //     //  ...
    //     let info = mock_info("alice_key", &[]);
    //     let price = coin(10, FEE_DENOM);
    //     let set_price_msg = ExecuteMsg::SetSubscription {
    //         price: price.clone(),
    //         duration: 30u64.into(),
    //     };

    //     let _res = execute(deps.as_mut(), env.clone(), info.clone(), set_price_msg)
    //         .expect("contract successfully handles SetSubscription message");

    //     // Bob wants to sub to Alice, which should cost him 10 CORE, but he attaches 15 CORE to the transaction...
    //     let subscribe_info = mock_info("bob_key", &coins(15, FEE_DENOM));
    //     let subscribe_msg = ExecuteMsg::Subscribe {
    //         did: "alice_did".to_string(),
    //     };
    //     let res = execute(
    //         deps.as_mut(),
    //         env.clone(),
    //         subscribe_info.clone(),
    //         subscribe_msg.clone(),
    //     )
    //     .expect("contract successfully handles Subscribe message");

    //     // .. and he gets 5 CORE refunded
    //     let attributes = res.attributes;
    //     let refund_attribute = attributes
    //         .iter()
    //         .find(|&attr| attr.key == "refund")
    //         .unwrap();
    //     assert_eq!(
    //         refund_attribute.value, format!("5{}", FEE_DENOM.to_string()),
    //         "Expected refund of 5 {}", FEE_DENOM.to_string()
    //     );

    //     // confirm Bob is a subscriber of Alice...
    //     let is_bob_subscriber_msg = QueryMsg::IsSubscriber {
    //         did: "alice_did".to_string(),
    //         subscriber: "bob_did".to_string(),
    //     };
    //     let res = query(deps.as_ref(), env.clone(), is_bob_subscriber_msg).unwrap();
    //     let value: bool = from_json(&res).unwrap();
    //     assert!(value, "Expected Bob to be a subscriber of Alice");

    //     // ... and Claire isn't
    //     let is_claire_subscriber_msg = QueryMsg::IsSubscriber {
    //         did: "alice_did".to_string(),
    //         subscriber: "claire_did".to_string(),
    //     };
    //     let res = query(deps.as_ref(), env.clone(), is_claire_subscriber_msg.clone()).unwrap();
    //     let value: bool = from_json(&res).unwrap();
    //     assert!(
    //         value == false,
    //         "Expected Claire not to be a subscriber of Alice at this moment"
    //     );

    //     // Claire tries to subscribe to Alice by attaching 15 CORE, less than needed
    //     // since Alice already has 1 subscriber so the price is 20 CORE
    //     let claire_subscribe_info = mock_info("claire_key", &coins(15, FEE_DENOM));
    //     let _ = execute(
    //         deps.as_mut(),
    //         env.clone(),
    //         claire_subscribe_info.clone(),
    //         subscribe_msg.clone(),
    //     )
    //     .expect_err("contract successfully handles Subscribe message");

    //     let res = query(deps.as_ref(), env.clone(), is_claire_subscriber_msg.clone()).unwrap();
    //     let value: bool = from_json(&res).unwrap();
    //     assert!(
    //         value == false,
    //         "Expected Claire not to be a subscriber of Alice at this moment"
    //     );

    //     // Claire tries to subscribe to Alice by attaching 55 CORE, more than needed
    //     let claire_subscribe_info = mock_info("claire_key", &coins(55, FEE_DENOM));
    //     let claire_sub_res = execute(
    //         deps.as_mut(),
    //         env.clone(),
    //         claire_subscribe_info.clone(),
    //         subscribe_msg.clone(),
    //     )
    //     .expect("contract successfully handles Subscribe message");

    //     let res = query(deps.as_ref(), env.clone(), is_claire_subscriber_msg).unwrap();
    //     let value: bool = from_json(&res).unwrap();
    //     assert!(
    //         value,
    //         "Expected Claire to be a subscriber of Alice at this moment"
    //     );

    //     // She should get 55 - 20 = 35 CORE as a refund
    //     let attributes = claire_sub_res.attributes;
    //     let refund_attribute = attributes
    //         .iter()
    //         .find(|&attr| attr.key == "refund")
    //         .unwrap();
    //     assert_eq!(
    //         refund_attribute.value, format!("35{}", FEE_DENOM.to_string()),
    //         "Expected refund of 35 {}", FEE_DENOM.to_string()
    //     );
    // }

    // #[test]
    // fn subscribe_nonexistent_did() {
    //     let mut deps = mock_dependencies();

    //     mock_init_no_price(deps.as_mut());
    //     // register actors
    //     mock_register(deps.as_mut(), "bob", &[coin(10, "core")]);

    //     let subscribe_info = mock_info("bob_key", &coins(10, "core"));
    //     let subscribe_msg = ExecuteMsg::Subscribe {
    //         did: "nonexistent_did".to_string(),
    //     };

    //     let res = execute(deps.as_mut(), mock_env(), subscribe_info, subscribe_msg);

    //     assert!(
    //         res.is_err(),
    //         "Expected subscribe call to fail for nonexistent DID"
    //     );
    // }

    // #[test]
    // fn subscribe_nft_issued() {
    //     let mut deps = mock_dependencies();

    //     mock_init_no_price(deps.as_mut());
    //     // register actors
    //     mock_register(deps.as_mut(), "alice", &[coin(10, "core")]);
    //     mock_register(deps.as_mut(), "bob", &[coin(10, "core")]);

    //     let subscribe_info = mock_info("bob_key", &coins(10, "core"));
    //     let subscribe_msg = ExecuteMsg::Subscribe {
    //         did: "alice_did".to_string(),
    //     };

    //     // // get all NFTs for Bob and see if he's got one NFT from Alice's collection
    //     // let get_nft_message = assetnft::Query::Class { id: "alice_did".to_string() };

    //     // // TODO: change this to {contract_address}-{profile_did}
    //     // // issues NFTs will have IDs of the form {contract_address}-{profile_did}-{subscriber_did}
    //     // let class_id = format!(
    //     //     "{}-{}",
    //     //     "alice_did".to_string(),
    //     //     "alice_did".to_string()
    //     //     // target_address[..26].to_string(),
    //     //     // env.contract.address
    //     // );
    //     // let nft_id = format!("{}-{}", class_id, "bob_did");
    //     // let request: QueryRequest<CoreumQueries> =
    //     //     CoreumQueries::NFT(nft::Query::NFT { class_id, nft_id }).into();
    //     // let res: Option<nft::NFTResponse> = deps.querier.raw_query(&request);

    //     // // https://github.com/CoreumFoundation/coreum-wasm-sdk/blob/main/src/nft.rs

    //     // // // // TODO: change this
    //     // // match res {
    //     // //     Some(nft) => to_binary(&true),
    //     // //     None => to_binary(&false),
    //     // // }

    //     let res = execute(
    //         deps.as_mut(),
    //         mock_env(),
    //         subscribe_info.clone(),
    //         subscribe_msg.clone(),
    //     );
    //     assert!(res.is_ok(), "Expected subscribe call to suceed");
    // }

    // #[test]
    // fn subscribe_payout_owner() {
    //     let env = mock_env();
    //     let mut deps = mock_dependencies_with_balances(&[
    //         (
    //             "alice_key",
    //             &[Coin {
    //                 amount: Uint128::from(20u128),
    //                 denom: FEE_DENOM.to_string(),
    //             }],
    //         ),
    //         (
    //             "bob_key",
    //             &[Coin {
    //                 amount: Uint128::from(20u128),
    //                 denom: FEE_DENOM.to_string(),
    //             }],
    //         ),
    //         (
    //             "claire_key",
    //             &[Coin {
    //                 amount: Uint128::from(20u128),
    //                 denom: FEE_DENOM.to_string(),
    //             }],
    //         ),
    //     ]);
    //     mock_init_no_price(deps.as_mut());

    //     // register actors
    //     mock_register(deps.as_mut(), "alice", &[]);
    //     mock_register(deps.as_mut(), "bob", &[]);
    //     mock_register(deps.as_mut(), "claire", &[]);

    //     let balance_request = QueryRequest::Bank(cosmwasm_std::BankQuery::Balance {
    //         // coreum_wasm_sdk::assetft::Query::Balance {
    //         address: "claire_key".to_string(),
    //         denom: FEE_DENOM.to_string(),
    //     });
    //     // let q: QueryRequest<CoreumQueries> = balance_request.into();

    //     let balance_response: BalanceResponse = deps
    //         .as_mut()
    //         .querier
    //         .query::<cosmwasm_std::BalanceResponse>(&balance_request)
    //         .unwrap();
    //     println!("{:?}", balance_response);

    //     let info = mock_info("alice_key", &[]);
    //     let price = coin(20, FEE_DENOM);
    //     let set_price_msg = ExecuteMsg::SetSubscription {
    //         price: price.clone(),
    //         duration: 30u64.into(),
    //     };

    //     let _res = execute(deps.as_mut(), env.clone(), info.clone(), set_price_msg)
    //         .expect("contract successfully handles SetSubscription message");

    //     let subscribe_msg = ExecuteMsg::Subscribe {
    //         did: "alice_did".to_string(),
    //     };

    //     let claire_subscribe_info = mock_info("claire_key", &coins(20, FEE_DENOM));
    //     let res = execute(
    //         deps.as_mut(),
    //         env.clone(),
    //         claire_subscribe_info,
    //         subscribe_msg,
    //     );
    //     println!("{:?}", res);

    //     assert!(
    //         res.is_ok(),
    //         "Expected subscribe call to succeed, it failed with error: {:?}",
    //         res.err()
    //     );

    //     let response = res.unwrap();

    //     // Check that Alice got paid
    //     let alice_got_paid = response.messages.iter().any(|msg| match &msg.msg {
    //         CosmosMsg::Bank(BankMsg::Send { to_address, amount }) => {
    //             to_address == "alice_key"
    //                 && amount.iter().any(|coin| {
    //                     coin.amount == Uint128::from(19u128) && coin.denom == FEE_DENOM
    //                 })
    //         }
    //         _ => false,
    //     });
    //     assert!(alice_got_paid, "Expected alice_key to be paid 19 {}", FEE_DENOM);

    //     // this is how one would normally check if the balance was deducted from claire_key and moved to alice_key
    //     // but mocked deps have immutable balances
    //     // so instead, the most we can do without coreum_test_tube is the assert for the correct returned CoreumMsg from the execute call above
    //     // {
    //     //     let balance_request = QueryRequest::Bank(cosmwasm_std::BankQuery::Balance {
    //     //         address:  "claire_key".to_string(),
    //     //         denom: FEE_DENOM.to_string(),
    //     //     });
    //     //     let deps = get_deps(&mut deps);
    //     //     let balance_response: BalanceResponse = deps.querier.query::<cosmwasm_std::BalanceResponse>(&balance_request).unwrap();
    //     //     println!("{:?}", balance_response);
    //     //     assert!(balance_response.amount.amount == Uint128::from(0u128));
    //     // }
    // }

    // #[test]
    // fn subscribe_validity_should_expire() {
    //     let mut env = mock_env();
    //     let mut deps = mock_dependencies_with_balances(&[
    //         (
    //             "alice_key",
    //             &[Coin {
    //                 amount: Uint128::from(20u128),
    //                 denom: FEE_DENOM.to_string(),
    //             }],
    //         ),
    //         (
    //             "bob_key",
    //             &[Coin {
    //                 amount: Uint128::from(20u128),
    //                 denom: FEE_DENOM.to_string(),
    //             }],
    //         ),
    //         (
    //             "claire_key",
    //             &[Coin {
    //                 amount: Uint128::from(20u128),
    //                 denom: FEE_DENOM.to_string(),
    //             }],
    //         ),
    //     ]);
    //     mock_init_no_price(deps.as_mut());

    //     // register actors
    //     mock_register(deps.as_mut(), "alice", &[]);
    //     mock_register(deps.as_mut(), "bob", &[]);
    //     mock_register(deps.as_mut(), "claire", &[]);

    //     let subscribe_msg = ExecuteMsg::Subscribe {
    //         did: "alice_did".to_string(),
    //     };

    //     // subscribe claire to alice
    //     let claire_subscribe_info = mock_info("claire_key", &coins(20, FEE_DENOM));
    //     let res = execute(
    //         deps.as_mut(),
    //         env.clone(),
    //         claire_subscribe_info,
    //         subscribe_msg,
    //     );
    //     println!("{:?}", res);
    //     assert!(
    //         res.is_ok(),
    //         "Expected subscribe call to succeed, it failed with error: {:?}",
    //         res.err()
    //     );

    //     // confirm we are subscribed now
    //     let is_subscriber_msg = QueryMsg::IsSubscriber {
    //         did: "alice_did".to_string(),
    //         subscriber: "claire_did".to_string(),
    //     };
    //     let res = query(deps.as_ref(), env.clone(), is_subscriber_msg.clone()).unwrap();
    //     let value: bool = from_json(&res).unwrap();
    //     assert!(value, "Expected Claire to be a subscriber of Alice");

    //     // move the clock forward in time for one month
    //     env.block.time = env.block.time.plus_days(31);

    //     // confirm we are NOT subscribed now
    //     let res = query(deps.as_ref(), env.clone(), is_subscriber_msg).unwrap();
    //     let value: bool = from_json(&res).unwrap();
    //     assert!(
    //         !value,
    //         "Expected Claire's subscription to Alice to expire after a month."
    //     );
    // }

    // #[test]
    // fn subscribe_reject_double_subscription() {
    //     let env = mock_env();
    //     let mut deps = mock_dependencies_with_balances(&[
    //         (
    //             "alice_key",
    //             &[Coin {
    //                 amount: Uint128::from(20u128),
    //                 denom: FEE_DENOM.to_string(),
    //             }],
    //         ),
    //         (
    //             "bob_key",
    //             &[Coin {
    //                 amount: Uint128::from(20u128),
    //                 denom: FEE_DENOM.to_string(),
    //             }],
    //         ),
    //         (
    //             "claire_key",
    //             &[Coin {
    //                 amount: Uint128::from(20u128),
    //                 denom: FEE_DENOM.to_string(),
    //             }],
    //         ),
    //     ]);

    //     mock_init_no_price(deps.as_mut());

    //     // register actors
    //     mock_register(deps.as_mut(), "alice", &[]);
    //     mock_register(deps.as_mut(), "bob", &[]);
    //     mock_register(deps.as_mut(), "claire", &[]);

    //     let subscribe_msg = ExecuteMsg::Subscribe {
    //         did: "alice_did".to_string(),
    //     };
    //     let claire_subscribe_info = mock_info("claire_key", &coins(20, FEE_DENOM));

    //     // subscribe claire to alice once

    //     let res = execute(
    //         deps.as_mut(),
    //         env.clone(),
    //         claire_subscribe_info.clone(),
    //         subscribe_msg.clone(),
    //     );
    //     println!("{:?}", res);
    //     // let is_sub = is_subscriber(deps.as_ref(), env, "alice_did".to_string(), "claire_did".to_string());

    //     assert!(
    //         res.is_ok(),
    //         "Expected subscribe call to succeed, it failed with error: {:?}",
    //         res.err()
    //     );

    //     // try subscribing claire to alice again

    //     let res = execute(
    //         deps.as_mut(),
    //         env.clone(),
    //         claire_subscribe_info,
    //         subscribe_msg,
    //     );
    //     println!("{:?}", res);

    //     assert!(
    //         res.is_err(),
    //         "Expected subscribe call to fail due to an existing subscription"
    //     );
    // }

    #[test]
    fn subscribe_payout_owner_tube() {
        with_test_tube(InstantiateMsg::zero(), 
            &|accounts: Vec<SigningAccount>, contract_addr: String, wasm: Wasm<CoreumTestApp>, bank: Bank<CoreumTestApp>, nft: NFT<CoreumTestApp>| {

            // register actors
            let alice = accounts.get(1).unwrap();
            let bob = accounts.get(2).unwrap();

            mock_register_account(&wasm, &contract_addr, alice, "alice".to_string());
            mock_register_account(&wasm, &contract_addr, bob, "bob".to_string());

            // bob sets his subscription price, Alice leaves it at zero
            let bob_sub_price = Uint128::from(10_000_000_000u128);
            let set_sub_price_msg = ExecuteMsg::SetSubscription { 
                price: Coin::new(bob_sub_price.u128(), FEE_DENOM), 
                duration: Uint64::one()
            };
            wasm.execute(&contract_addr, &set_sub_price_msg, &[], &bob).unwrap();

            // now try "free" subscription (Bob subscribes to Alice)
            let subscribe_msg = ExecuteMsg::Subscribe {
                did: "alicedid".to_string(),
            };

            let alice_balance_before = get_balance(&bank, alice);
            let _ = wasm.execute::<ExecuteMsg>(
                    &contract_addr,
                    &subscribe_msg,
                    // &coins(10_000_000_000, FEE_DENOM.to_string()),
                    &[],
                    &bob
                )
                .unwrap();
            // let tx_gas_cost = Uint128::from(res.gas_info.gas_used);

            // confirm Alice did not get got paid (subscription is free)
            let alice_balance_after = get_balance(&bank, alice);
            assert!(alice_balance_before == alice_balance_after);


            // now try "paid" subscription (Alice subscribes to Bob)
            let subscribe_msg = ExecuteMsg::Subscribe {
                did: "bobdid".to_string(),
            };

            let bob_balance_before = get_balance(&bank, bob);
            let _ = wasm.execute::<ExecuteMsg>(
                    &contract_addr,
                    &subscribe_msg,
                    &coins(bob_sub_price.u128(), FEE_DENOM.to_string()),
                    // &[],
                    &alice
                )
                .unwrap();
            // let tx_gas_cost = Uint128::from(res.gas_info.gas_used);

            // confirm Alice did not get got paid (subscription is free)
            let bob_balance_after = get_balance(&bank, bob);
            assert!(bob_balance_before + bob_sub_price == bob_balance_after);
        });
    }


    #[test]
    fn subscribe_mints_nft() {
        with_test_tube(InstantiateMsg::zero(), 
        &|accounts: Vec<SigningAccount>, contract_addr: String, wasm: Wasm<CoreumTestApp>, bank: Bank<CoreumTestApp>, nft: NFT<CoreumTestApp>| {

            // register actors
            let alice = accounts.get(1).unwrap();
            let bob = accounts.get(2).unwrap();

            mock_register_account(&wasm, &contract_addr, alice, "alice".to_string());
            mock_register_account(&wasm, &contract_addr, bob, "bob".to_string());

            // Bob subscribes to Alice
            let subscribe_msg = ExecuteMsg::Subscribe {
                did: "alicedid".to_string(),
            };
            let res = wasm.execute(&contract_addr, &subscribe_msg, &[], &bob);
            println!("{:?}", res);
            
            // query the contract's is_subscriber function
            // which relies on the existance of the NFT
            let is_sub_msg = QueryMsg::IsSubscriber {
                target_did: "alicedid".to_string(),
                subscriber_wallet: bob.address().to_string(),
            };
            // let res = wasm.query::<QueryMsg, bool>(&contract_addr, &is_sub_msg);
            // println!("{:?}", res);

            // let is_sub = wasm.query::<QueryMsg, bool>(&contract_addr, &is_sub_msg).unwrap();
            // assert!(is_sub)
        });
    }

}


