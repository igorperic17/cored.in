#[cfg(test)]
mod tests {
    use coreum_test_tube::{Account, Bank, CoreumTestApp, Module, SigningAccount, Wasm, NFT};
    use crate::contract::FEE_DENOM;
    use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
    use crate::tests::test_common::test_common::{get_balance, mock_register_account, with_test_tube, INITIAL_BALANCE};
    use cosmwasm_std::{coins, Coin, Uint128, Uint64};

    #[test]
    fn subscribe_payout_owner() {
        with_test_tube(InstantiateMsg::zero(), 
            &|accounts: Vec<SigningAccount>, contract_addr: String, wasm: Wasm<CoreumTestApp>, bank: Bank<CoreumTestApp>, _nft: NFT<CoreumTestApp>| {

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
        &|accounts: Vec<SigningAccount>, contract_addr: String, wasm: Wasm<CoreumTestApp>, _bank: Bank<CoreumTestApp>, _nft: NFT<CoreumTestApp>| {

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
            println!("{:?}", is_sub);
            
            // expect that is_sub is false (still not subscribed)
            assert!(is_sub.is_ok() && !is_sub.unwrap());

            // Bob subscribes to Alice
            let subscribe_msg = ExecuteMsg::Subscribe {
                did: "alicedid".to_string(),
            };
            let _ = wasm.execute(&contract_addr, &subscribe_msg, &[], &bob);

            let is_sub = wasm.query::<QueryMsg, bool>(&contract_addr, &is_sub_msg);
            // expect that is_sub is true after subscription
            assert!(is_sub.is_ok() && is_sub.unwrap());
        });
    }

    #[test]
    fn subscription_expires() {
        
        // Create new Coreum appchain instance.
        let app = CoreumTestApp::new();

        // `Wasm` is the module we use to interact with cosmwasm releated logic on the appchain
        let wasm = Wasm::new(&app);

        // init multiple accounts
        let accs = app
                    .init_accounts(&coins( INITIAL_BALANCE, FEE_DENOM.to_string()), 3)
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
        app.increase_time(2* 60*60*24*30);

        let is_sub = wasm.query::<QueryMsg, bool>(&contract_addr, &is_sub_msg);
        // expect that is_sub is false after subscription expires
        assert!(is_sub.is_ok() && !is_sub.unwrap());
        
    }

}


