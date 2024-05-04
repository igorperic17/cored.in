// not used
// leaving here for the reference

#[cfg(test)]
mod tests {
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coin, coins, from_binary, Coin, Deps, DepsMut, Addr};

    use crate::contract::{execute, instantiate, query};
    use crate::error::ContractError;
    use crate::msg::{ExecuteMsg, GetDIDResponse, QueryMsg, InstantiateMsg};
    use crate::state::Config;

    fn assert_name_owner(deps: Deps, name: &str, owner: &Addr) {
        let res = query(
            deps,
            mock_env(),
            QueryMsg::GetUsernameDID {
                username: name.to_string(),
            },
        )
        .unwrap();

        let value: GetDIDResponse = from_binary(&res).unwrap();
        assert_eq!(Some(owner.to_string()), Some(value.did_info.unwrap().wallet.to_string()));
    }

    fn assert_config_state(deps: Deps, expected: Config) {
        let res = query(deps, mock_env(), QueryMsg::Config {}).unwrap();
        let value: Config = from_binary(&res).unwrap();
        assert_eq!(value, expected);
    }

    fn mock_init_with_price(deps: DepsMut, purchase_price: Coin, transfer_price: Coin) {
        let msg = InstantiateMsg {
            purchase_price: Some(purchase_price),
            transfer_price: Some(transfer_price),
        };

        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps, mock_env(), info, msg)
            .expect("contract successfully handles InstantiateMsg");
    }

    fn mock_init_no_price(deps: DepsMut) {
        let msg = InstantiateMsg {
            purchase_price: None,
            transfer_price: None,
        };

        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps, mock_env(), info, msg)
            .expect("contract successfully handles InstantiateMsg");
    }

    fn mock_alice_registers_name(deps: DepsMut, sent: &[Coin]) {
        // alice can register an available name
        let info = mock_info("alice_key", sent);
        let msg = ExecuteMsg::Register {
            username: "alice".to_string(),
            did: "alice_did".to_string(),
        };
        let _res = execute(deps, mock_env(), info, msg)
            .expect("contract successfully handles Register message");
    }

    #[test]
    fn proper_init_no_fees() {
        let mut deps = mock_dependencies();

        mock_init_no_price(deps.as_mut());

        assert_config_state(
            deps.as_ref(),
            Config {
                owner: Addr::unchecked("creator"),
                purchase_price: None,
                transfer_price: None,
            },
        );
    }

    #[test]
    fn proper_init_with_fees() {
        let mut deps = mock_dependencies();

        mock_init_with_price(deps.as_mut(), coin(3, "token"), coin(4, "token"));

        assert_config_state(
            deps.as_ref(),
            Config {
                owner: Addr::unchecked("creator"),
                purchase_price: Some(coin(3, "token")),
                transfer_price: Some(coin(4, "token")),
            },
        );
    }

    #[test]
    fn register_available_name_and_query_works() {
        let mut deps = mock_dependencies();
        mock_init_no_price(deps.as_mut());
        mock_alice_registers_name(deps.as_mut(), &[]);

        // querying for name resolves to correct address
        assert_name_owner(deps.as_ref(), "alice", &Addr::unchecked("alice_key"));
    }

    #[test]
    fn register_available_name_and_query_works_with_fees() {
        let mut deps = mock_dependencies();
        mock_init_with_price(deps.as_mut(), coin(2, "token"), coin(2, "token"));
        mock_alice_registers_name(deps.as_mut(), &coins(2, "token"));

        // anyone can register an available name with more fees than needed
        let info = mock_info("bob_key", &coins(5, "token"));
        let msg = ExecuteMsg::Register {
            username: "bob".to_string(),
            did: "awesome_did".to_string()
        };

        let _res = execute(deps.as_mut(), mock_env(), info, msg)
            .expect("contract successfully handles Register message");

        // querying for name resolves to correct address
        assert_name_owner(deps.as_ref(), "alice", &Addr::unchecked("alice_key"));
        assert_name_owner(deps.as_ref(), "bob", &Addr::unchecked("bob_key"));
    }

    #[test]
    fn fails_on_register_already_taken_name() {
        let mut deps = mock_dependencies();
        mock_init_no_price(deps.as_mut());
        mock_alice_registers_name(deps.as_mut(), &[]);

        // bob can't register the same name
        let info = mock_info("bob_key", &coins(2, "token"));
        let msg = ExecuteMsg::Register {
            username: "alice".to_string(),
            did: "awesome_did".to_string()
        };
        let res = execute(deps.as_mut(), mock_env(), info, msg);

        match res {
            Ok(_) => panic!("Must return error"),
            Err(ContractError::NameTaken { .. }) => {}
            Err(_) => panic!("Unknown error"),
        }
        // alice can't register the same name again
        let info = mock_info("alice_key", &coins(2, "token"));
        let msg = ExecuteMsg::Register {
            username: "alice".to_string(),
            did: "awesome_did".to_string()
        };
        let res = execute(deps.as_mut(), mock_env(), info, msg);

        match res {
            Ok(_) => panic!("Must return error"),
            Err(ContractError::NameTaken { .. }) => {}
            Err(e) => panic!("Unexpected error: {:?}", e),
        }
    }

    #[test]
    fn register_available_name_fails_with_invalid_name() {
        let mut deps = mock_dependencies();
        mock_init_no_price(deps.as_mut());
        let info = mock_info("bob_key", &coins(2, "token"));

        // hi is too short
        let msg = ExecuteMsg::Register {
            username: "hi".to_string(),
            did: "short_did".to_string()
        };
        match execute(deps.as_mut(), mock_env(), info.clone(), msg) {
            Ok(_) => panic!("Must return error"),
            Err(ContractError::NameTooShort { .. }) => {}
            Err(_) => panic!("Unknown error"),
        }

        // 65 chars is too long
        let msg = ExecuteMsg::Register {
            username: "01234567890123456789012345678901234567890123456789012345678901234".to_string(),
            did: "long_did".to_string()
        };
        match execute(deps.as_mut(), mock_env(), info.clone(), msg) {
            Ok(_) => panic!("Must return error"),
            Err(ContractError::NameTooLong { .. }) => {}
            Err(_) => panic!("Unknown error"),
        }

        // no upper case...
        let msg = ExecuteMsg::Register {
            username: "ALICE".to_string(),
            did: "LOUD_DID".to_string()
        };
        match execute(deps.as_mut(), mock_env(), info.clone(), msg) {
            Ok(_) => panic!("Must return error"),
            Err(ContractError::InvalidCharacter { c }) => assert_eq!(c, 'A'),
            Err(_) => panic!("Unknown error"),
        }
        // ... or spaces
        let msg = ExecuteMsg::Register {
            username: "two words".to_string(),
            did: "D   I    D".to_string()
        };
        match execute(deps.as_mut(), mock_env(), info, msg) {
            Ok(_) => panic!("Must return error"),
            Err(ContractError::InvalidCharacter { .. }) => {}
            Err(_) => panic!("Unknown error"),
        }
    }

    #[test]
    fn fails_on_register_insufficient_fees() {
        let mut deps = mock_dependencies();
        mock_init_with_price(deps.as_mut(), coin(2, "token"), coin(2, "token"));

        // anyone can register an available name with sufficient fees
        let info = mock_info("alice_key", &[]);
        let msg = ExecuteMsg::Register {
            did: "broke_alice".to_string(),
            username: "awesome_did".to_string()
        };

        let res = execute(deps.as_mut(), mock_env(), info, msg);

        match res {
            Ok(_) => panic!("register call should fail with insufficient fees"),
            Err(ContractError::InsufficientFundsSend {}) => {}
            Err(e) => panic!("Unexpected error: {:?}", e),
        }
    }

    #[test]
    fn fails_on_register_wrong_fee_denom() {
        let mut deps = mock_dependencies();
        mock_init_with_price(deps.as_mut(), coin(2, "token"), coin(2, "token"));

        // anyone can register an available name with sufficient fees
        let info = mock_info("alice_key", &coins(2, "earth"));
        let msg = ExecuteMsg::Register {
            username: "wrong_alice".to_string(),
            did: "awesome_did".to_string()
        };

        let res = execute(deps.as_mut(), mock_env(), info, msg);

        match res {
            Ok(_) => panic!("register call should fail with insufficient fees"),
            Err(ContractError::InsufficientFundsSend {}) => {}
            Err(e) => panic!("Unexpected error: {:?}", e),
        }
    }

    #[test]
    fn returns_empty_on_query_unregistered_name() {
        let mut deps = mock_dependencies();

        mock_init_no_price(deps.as_mut());

        // querying for unregistered name results in NotFound error
        let res = query(
            deps.as_ref(),
            mock_env(),
            QueryMsg::GetUsernameDID {
                username: "alice".to_string(),
            },
        )
        .unwrap();
        let value: GetDIDResponse = from_binary(&res).unwrap();
        assert_eq!(None, value.did_info);
    }
}
