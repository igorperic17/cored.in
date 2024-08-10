// src/tests/common.rs

#[cfg(test)]
pub mod common {

    use coreum_wasm_sdk::types::cosmos::bank::v1beta1::QueryBalanceRequest;
    use cosmwasm_std::testing::{mock_env, mock_info};
    use cosmwasm_std::{coin, coins, from_json, Addr, Coin, Deps, DepsMut, Int128, Uint128};

    use crate::contract::{execute, instantiate, query, FEE_DENOM};
    use crate::msg::{ExecuteMsg, GetDIDResponse, InstantiateMsg, QueryMsg};
    use std::str::FromStr;

    // pub fn assert_name_owner(deps: Deps, name: &str, owner: &Addr) {
    //     let res = query(
    //         deps,
    //         mock_env(),
    //         QueryMsg::GetUsernameDID {
    //             username: name.to_string(),
    //         },
    //     )
    //     .unwrap();

    //     let value: GetDIDResponse = from_json(&res).unwrap();
    //     assert_eq!(
    //         Some(owner.to_string()),
    //         Some(value.did_info.unwrap().wallet.to_string())
    //     );
    // }

    // pub fn assert_config_state(deps: Deps, expected: Config) {
    //     let res = query(deps, mock_env(), QueryMsg::Config {}).unwrap();
    //     let value: Config = from_json(&res).unwrap();
    //     assert_eq!(value, expected);
    // }

    // pub fn mock_init_with_price(deps: DepsMut, purchase_price: Coin, transfer_price: Coin) {
    //     let msg = InstantiateMsg {
    //         purchase_price: Some(purchase_price),
    //         transfer_price: Some(transfer_price),
    //     };

    //     let info = mock_info("creator", &coins(2, "token"));
    //     let _res = instantiate(deps, mock_env(), info, msg)
    //         .expect("contract successfully handles InstantiateMsg");
    // }

    // pub fn mock_init_no_price(deps: DepsMut) {
    //     let msg = InstantiateMsg {
    //         purchase_price: None,
    //         transfer_price: None,
    //     };

    //     let info = mock_info("creator", &coins(2, "token"));
    //     let _res = instantiate(deps, mock_env(), info, msg)
    //         .expect("contract successfully handles InstantiateMsg");
    // }

    // pub fn mock_register(deps: DepsMut, name: &str, sent: &[Coin]) {
    //     // alice can register an available name
    //     let info = mock_info(format!("{}_key", name).as_str(), sent);
    //     let msg = ExecuteMsg::Register {
    //         username: format!("{}", name).as_str().to_string(),
    //         did: format!("{}_did", name).as_str().to_string(),
    //     };
    //     let _res = execute(deps, mock_env(), info, msg)
    //         .expect("contract successfully handles Register message");
    // }

    // pub fn mock_alice_registers_name(deps: DepsMut, sent: &[Coin]) {
    //     mock_register(deps, &"alice", sent)
    // }

    use coreum_test_tube::{Account, CoreumTestApp, Module, SigningAccount, Wasm, Bank};

    // initial balance of all accounts in test tube
    pub const INITIAL_BALANCE: u128 = 100_000_000_000;

    // function pointer is invoked when mock env is set to execute test defined in the injected function
    // signature: (app, accounts, contract_addr, code_id, wasm)
    pub fn with_test_tube(intantiate_msg: InstantiateMsg, f: &dyn Fn(Vec<SigningAccount>, String, Wasm<CoreumTestApp>, Bank<CoreumTestApp>)) {

        // test-tube setup

        // Create new Coreum appchain instance.
        let app = CoreumTestApp::new();

        // `Wasm` is the module we use to interact with cosmwasm releated logic on the appchain
        let wasm = Wasm::new(&app);

        // init wrapper modules
        let bank = Bank::new(&app);

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
                        &intantiate_msg,
                        Some(admin.address().as_str()),
                        "cored.in".into(),
                        // &coins(100_000_000_000, FEE_DENOM.to_string()),
                        &[],
                        &admin,
                    )
                    .unwrap()
                    .data
                    .address;

        f(accs, contract_addr, wasm, bank);
    }

    pub fn mock_register_account(wasm: &Wasm<CoreumTestApp>, contract_addr: &String, account: &SigningAccount, username: String) {
            let register_did_msg = ExecuteMsg::Register {
                did: format!("{}_did", username).to_string(),
                username: username
            };
            wasm.execute::<ExecuteMsg>(
                    &contract_addr,
                    &register_did_msg,
                    // &coins(10_000_000_000, FEE_DENOM),
                    &[], // no attached coins
                    &account
                )
                .unwrap();
    }

    // helper function to check the current balance of an account
    pub fn get_balance(bank: &Bank<CoreumTestApp>, account: &SigningAccount) -> Uint128 {
        let balance_msg = QueryBalanceRequest {
            address:  account.address().to_string(),
            denom: FEE_DENOM.to_string(),
        };

        let balance_response = bank.query_balance(&balance_msg).unwrap();
        Uint128::from_str(balance_response.balance.unwrap().amount.as_str()).unwrap()
    }
}
