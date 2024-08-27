#[cfg(test)]
mod tests {
    use crate::contract::FEE_DENOM;
    use crate::msg::{ExecuteMsg, GetSubscriptionListResponse, InstantiateMsg, QueryMsg};
    use crate::state::SubscriptionInfo;
    use crate::tests::test_common::test_common::{
        get_balance, mock_register_account, with_test_tube, INITIAL_BALANCE,
    };
    use coreum_test_tube::{Account, Bank, CoreumTestApp, Module, SigningAccount, Wasm, NFT};
    use cosmwasm_std::{coins, Coin, Uint128, Uint64};

    #[test]
    fn subscribe_payout_owner() {
        with_test_tube(
            InstantiateMsg::zero(),
            &|accounts: Vec<SigningAccount>,
              contract_addr: String,
              wasm: Wasm<CoreumTestApp>,
              bank: Bank<CoreumTestApp>,
              _nft: NFT<CoreumTestApp>| {
                // register actors
                let alice = accounts.get(1).unwrap();
                let bob = accounts.get(2).unwrap();

                mock_register_account(&wasm, &contract_addr, alice, "alice".to_string());
                mock_register_account(&wasm, &contract_addr, bob, "bob".to_string());

                // bob sets his subscription price, Alice leaves it at zero
                let bob_sub_price = Uint128::from(10_000_000_000u128);
                let set_sub_price_msg = ExecuteMsg::SetSubscription {
                    price: Coin::new(bob_sub_price.u128(), FEE_DENOM),
                    duration: Uint64::one(),
                };
                wasm.execute(&contract_addr, &set_sub_price_msg, &[], &bob)
                    .unwrap();

                // now try "free" subscription (Bob subscribes to Alice)
                let subscribe_msg = ExecuteMsg::Subscribe {
                    did: "alicedid".to_string(),
                };

                let alice_balance_before = get_balance(&bank, alice);
                let _ = wasm
                    .execute::<ExecuteMsg>(
                        &contract_addr,
                        &subscribe_msg,
                        // &coins(10_000_000_000, FEE_DENOM.to_string()),
                        &[],
                        &bob,
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
                let _ = wasm
                    .execute::<ExecuteMsg>(
                        &contract_addr,
                        &subscribe_msg,
                        &coins(bob_sub_price.u128(), FEE_DENOM.to_string()),
                        // &[],
                        &alice,
                    )
                    .unwrap();
                // let tx_gas_cost = Uint128::from(res.gas_info.gas_used);

                // confirm Alice did not get got paid (subscription is free)
                let bob_balance_after = get_balance(&bank, bob);
                assert!(bob_balance_before + bob_sub_price == bob_balance_after);
            },
        );
    }

    #[test]
    fn subscribe_mints_nft() {
        with_test_tube(
            InstantiateMsg::zero(),
            &|accounts: Vec<SigningAccount>,
              contract_addr: String,
              wasm: Wasm<CoreumTestApp>,
              _bank: Bank<CoreumTestApp>,
              _nft: NFT<CoreumTestApp>| {
                // register actors
                let alice = accounts.get(1).unwrap();
                let bob = accounts.get(2).unwrap();

                mock_register_account(&wasm, &contract_addr, alice, "alice".to_string());
                mock_register_account(&wasm, &contract_addr, bob, "bob".to_string());

                // query the contract's is_subscriber function
                // which relies on the existance of the NFT
                let is_sub_msg = QueryMsg::IsSubscriber {
                    target_did: "alicedid".to_string(),
                    subscriber_wallet: bob.address().to_string(),
                };

                let is_sub = wasm.query::<QueryMsg, bool>(&contract_addr, &is_sub_msg);

                // expect that is_sub is false (still not subscribed)
                assert!(is_sub.is_ok() && !is_sub.unwrap());

                // Bob subscribes to Alice
                let subscribe_msg = ExecuteMsg::Subscribe {
                    did: "alicedid".to_string(),
                };
                let _ = wasm.execute(&contract_addr, &subscribe_msg, &[], &bob);

                let is_sub = wasm.query::<QueryMsg, bool>(&contract_addr, &is_sub_msg);
                println!("is_sub: {:?}", is_sub);
                // expect that is_sub is true after subscription
                assert!(is_sub.is_ok() && is_sub.unwrap());
            },
        );
    }

    #[test]
    fn subscription_expires() {
        // Create new Coreum appchain instance.
        let app = CoreumTestApp::new();

        // `Wasm` is the module we use to interact with cosmwasm releated logic on the appchain
        let wasm = Wasm::new(&app);

        // init multiple accounts
        let accs = app
            .init_accounts(&coins(INITIAL_BALANCE, FEE_DENOM.to_string()), 3)
            .unwrap();
        let admin = &accs.get(0).unwrap();

        // Store compiled wasm code on the appchain and retrieve its code id
        let wasm_byte_code = std::fs::read("./artifacts/coredin.wasm").unwrap();
        let code_id = wasm
            .store_code(&wasm_byte_code, None, &admin)
            .unwrap()
            .data
            .code_id;

        // Instantiate contract with initial admin (signer) account defined beforehand and make admin list mutable
        let contract_addr = wasm
            .instantiate(
                code_id,
                &InstantiateMsg::zero(),
                Some(admin.address().as_str()),
                "cored.in".into(),
                // &coins(100_000_000_000, FEE_DENOM.to_string()),
                &[],
                &admin,
            )
            .unwrap()
            .data
            .address;

        //// Bob subscribes to Alice

        // register actors
        let alice = accs.get(1).unwrap();
        let bob = accs.get(2).unwrap();

        mock_register_account(&wasm, &contract_addr, alice, "alice".to_string());
        mock_register_account(&wasm, &contract_addr, bob, "bob".to_string());

        // query the contract's is_subscriber function
        // which relies on the existance of the NFT
        let is_sub_msg = QueryMsg::IsSubscriber {
            target_did: "alicedid".to_string(),
            subscriber_wallet: bob.address().to_string(),
        };

        // Bob subscribes to Alice
        let subscribe_msg = ExecuteMsg::Subscribe {
            did: "alicedid".to_string(),
        };
        let _ = wasm.execute(&contract_addr, &subscribe_msg, &[], &bob);

        let is_sub = wasm.query::<QueryMsg, bool>(&contract_addr, &is_sub_msg);
        // expect that is_sub is true after subscription
        assert!(is_sub.is_ok() && is_sub.unwrap());

        //// Move the time forward by 2 months
        app.increase_time(2 * 60 * 60 * 24 * 30);

        let is_sub = wasm.query::<QueryMsg, bool>(&contract_addr, &is_sub_msg);
        // expect that is_sub is false after subscription expires
        assert!(is_sub.is_ok() && !is_sub.unwrap());
    }

    #[test]
    fn subscriber_list_works() {
        with_test_tube(
            InstantiateMsg::zero(),
            &|accounts: Vec<SigningAccount>,
              contract_addr: String,
              wasm: Wasm<CoreumTestApp>,
              _bank: Bank<CoreumTestApp>,
              _nft: NFT<CoreumTestApp>| {
                // register actors
                let alice = accounts.get(1).unwrap();
                let bob = accounts.get(2).unwrap();
                let claire = accounts.get(3).unwrap();

                mock_register_account(&wasm, &contract_addr, alice, "alice".to_string());
                mock_register_account(&wasm, &contract_addr, bob, "bob".to_string());
                mock_register_account(&wasm, &contract_addr, claire, "claire".to_string());

                let check_subs = |wallet: &SigningAccount,
                                  page: u64,
                                  page_size: u64,
                                  expected_subs: Vec<String>| {
                    let mut expected_subs = expected_subs.clone();
                    expected_subs.sort();
                    let sub_msg = QueryMsg::GetSubscribers {
                        wallet: wallet.address().to_string(),
                        page: Uint64::from(page),
                        page_size: Uint64::from(page_size),
                    };
                    let mut subs = wasm
                        .query::<QueryMsg, GetSubscriptionListResponse>(&contract_addr, &sub_msg)
                        .unwrap()
                        .subscribers;
                    subs.sort();
                    println!("subs: {:?}", subs);
                    println!("expected_subs: {:?}", expected_subs);

                    // extract the subscriber addresses
                    let subs_dids = subs
                        .iter()
                        .map(|sub| sub.subscriber.clone())
                        .collect::<Vec<String>>();

                    println!("subs_dids: {:?}", subs_dids);
                    assert!(subs_dids == expected_subs);
                };

                // Alice should not have any subscribers
                println!("Alice should not have any subscribers");
                check_subs(&alice, 0, 10, vec![]);
                check_subs(&alice, 2, 10, vec![]);
                check_subs(&alice, 0, 1, vec![]);
                check_subs(&alice, 0, 1000, vec![]);

                // Bob subscribes to Alice
                let subscribe_msg = ExecuteMsg::Subscribe {
                    did: "alicedid".to_string(),
                };
                let _ = wasm.execute(&contract_addr, &subscribe_msg, &[], &bob);

                // Alice should have Bob as a subscriber
                println!("Alice should have Bob");
                check_subs(&alice, 0, 10, vec!["bobdid".to_string()]);
                check_subs(&alice, 2, 10, vec![]); // Bob is on page 0
                check_subs(&alice, 0, 1, vec!["bobdid".to_string()]);
                check_subs(&alice, 0, 1000, vec!["bobdid".to_string()]);

                // Claire subscribes to Alice
                let subscribe_msg = ExecuteMsg::Subscribe {
                    did: "alicedid".to_string(),
                };
                let _ = wasm.execute(&contract_addr, &subscribe_msg, &[], &claire);

                // Alice should have Bob and Claire as subscribers
                check_subs(
                    &alice,
                    0,
                    10,
                    vec!["clairedid".to_string(), "bobdid".to_string()],
                );

                // Claire should be on the second page when page_size is 1
                // TODO: commenting due to the undeterministic behavior of the order of subscribers
                // check_subs(&alice, 1, 1, vec!["clairedid".to_string()]);
                // check_subs(&alice, 0, 1, vec!["bobdid".to_string()]);
            },
        );
    }

    #[test]
    fn subscription_list_works() {
        with_test_tube(
            InstantiateMsg::zero(),
            &|accounts: Vec<SigningAccount>,
              contract_addr: String,
              wasm: Wasm<CoreumTestApp>,
              _bank: Bank<CoreumTestApp>,
              _nft: NFT<CoreumTestApp>| {
                // register actors
                let alice = accounts.get(1).unwrap();
                let bob = accounts.get(2).unwrap();
                let claire = accounts.get(3).unwrap();

                mock_register_account(&wasm, &contract_addr, alice, "alice".to_string());
                mock_register_account(&wasm, &contract_addr, bob, "bob".to_string());
                mock_register_account(&wasm, &contract_addr, claire, "claire".to_string());

                let check_subs = |wallet: &SigningAccount,
                                  page: u64,
                                  page_size: u64,
                                  expected_subs: Vec<String>| {
                    let mut expected_subs = expected_subs.clone();
                    expected_subs.sort();
                    let sub_msg = QueryMsg::GetSubscriptions {
                        wallet: wallet.address().to_string(),
                        page: Uint64::from(page),
                        page_size: Uint64::from(page_size),
                    };
                    let mut subs = wasm
                        .query::<QueryMsg, GetSubscriptionListResponse>(&contract_addr, &sub_msg)
                        .unwrap()
                        .subscribers;
                    subs.sort();
                    // println!("subs: {:?}", subs);
                    // println!("expected_subs: {:?}", expected_subs);

                    // extract the subscriber addresses
                    let subs_dids = subs
                        .iter()
                        .map(|sub| sub.subscribed_to.clone())
                        .collect::<Vec<String>>();

                    // println!("subs_dids: {:?}", subs_dids);
                    assert!(subs_dids == expected_subs);
                };

                // Alice should not have any subscribers
                println!("Bob should not have any subscriptions");
                check_subs(&bob, 0, 10, vec![]);
                check_subs(&bob, 2, 10, vec![]);
                check_subs(&bob, 0, 1, vec![]);
                check_subs(&bob, 0, 1000, vec![]);

                // test subscriber count
                let sub_count_msg = QueryMsg::GetSubscriberCount {
                    wallet: claire.address().to_string(),
                };
                let sub_count = wasm.query::<QueryMsg, Uint64>(&contract_addr, &sub_count_msg);
                let count = sub_count.unwrap().clone();
                assert!(count == Uint64::from(0u64));

                // Bob subscribes to Alice
                let subscribe_msg = ExecuteMsg::Subscribe {
                    did: "alicedid".to_string(),
                };
                let _ = wasm.execute(&contract_addr, &subscribe_msg, &[], &bob);

                // Alice should have Bob as a subscriber
                println!("Bob should have Alice");
                check_subs(&bob, 0, 10, vec!["alicedid".to_string()]);
                check_subs(&bob, 2, 10, vec![]); // Bob is on page 0
                check_subs(&bob, 0, 1, vec!["alicedid".to_string()]);
                check_subs(&bob, 0, 1000, vec!["alicedid".to_string()]);

                // Bob subscribes to Claire
                let subscribe_msg = ExecuteMsg::Subscribe {
                    did: "clairedid".to_string(),
                };
                let _ = wasm.execute(&contract_addr, &subscribe_msg, &[], &bob);

                // Bob should have Alice and Claire as subscribers
                check_subs(
                    &bob,
                    0,
                    10,
                    vec!["clairedid".to_string(), "alicedid".to_string()],
                );

                // Claire should be on the second page when page_size is 1
                // TODO: commenting due to the undeterministic behavior of the order of subscribers
                // check_subs(&bob, 1, 1, vec!["clairedid".to_string()]);
                // check_subs(&bob, 0, 1, vec!["alicedid".to_string()]);

                // test subscriber count
                let sub_count = wasm.query::<QueryMsg, Uint64>(&contract_addr, &sub_count_msg);
                let count = sub_count.unwrap().clone();
                // println!("count: {:?}", count);
                assert!(count == Uint64::from(1u64));
            },
        );
    }

    #[test]
    fn resubscription_works() {
        // Create new Coreum appchain instance.
        let app = CoreumTestApp::new();

        // `Wasm` is the module we use to interact with cosmwasm releated logic on the appchain
        let wasm = Wasm::new(&app);

        // init multiple accounts
        let accs = app
            .init_accounts(&coins(INITIAL_BALANCE, FEE_DENOM.to_string()), 3)
            .unwrap();
        let admin = &accs.get(0).unwrap();

        // Store compiled wasm code on the appchain and retrieve its code id
        let wasm_byte_code = std::fs::read("./artifacts/coredin.wasm").unwrap();
        let code_id = wasm
            .store_code(&wasm_byte_code, None, &admin)
            .unwrap()
            .data
            .code_id;

        // Instantiate contract with initial admin (signer) account defined beforehand and make admin list mutable
        let contract_addr = wasm
            .instantiate(
                code_id,
                &InstantiateMsg::zero(),
                Some(admin.address().as_str()),
                "cored.in".into(),
                // &coins(100_000_000_000, FEE_DENOM.to_string()),
                &[],
                &admin,
            )
            .unwrap()
            .data
            .address;

        //// Bob subscribes to Alice

        // register actors
        let alice = accs.get(1).unwrap();
        let bob = accs.get(2).unwrap();

        mock_register_account(&wasm, &contract_addr, alice, "alice".to_string());
        mock_register_account(&wasm, &contract_addr, bob, "bob".to_string());

        // query the contract's is_subscriber function
        // which relies on the existance of the NFT
        let is_sub_msg = QueryMsg::IsSubscriber {
            target_did: "alicedid".to_string(),
            subscriber_wallet: bob.address().to_string(),
        };

        // Bob subscribes to Alice twice in a row
        let subscribe_msg = ExecuteMsg::Subscribe {
            did: "alicedid".to_string(),
        };
        let sub_1 = wasm.execute(&contract_addr, &subscribe_msg, &[], &bob);
        let sub_2 = wasm.execute(&contract_addr, &subscribe_msg, &[], &bob);
        println!("sub_1: {:?}", sub_1);
        println!("sub_2: {:?}", sub_2);
        // expect no errors
        assert!(sub_1.is_ok() && sub_2.is_ok());

        let is_sub = wasm.query::<QueryMsg, bool>(&contract_addr, &is_sub_msg);
        // expect that is_sub is true after the second subscription
        assert!(is_sub.is_ok() && is_sub.unwrap());

        //// Move the time forward by 2 months
        app.increase_time(2 * 60 * 60 * 24 * 30);

        let is_sub = wasm.query::<QueryMsg, bool>(&contract_addr, &is_sub_msg);
        // expect that is_sub is false after subscription expires
        assert!(is_sub.is_ok() && !is_sub.unwrap());

        // subscribe again
        let sub_3 = wasm.execute(&contract_addr, &subscribe_msg, &[], &bob);
        // expect that is_sub is true after the third subscription
        let is_sub = wasm.query::<QueryMsg, bool>(&contract_addr, &is_sub_msg);
        assert!(sub_3.is_ok() && is_sub.is_ok() && is_sub.unwrap());
    }
}
