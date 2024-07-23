// src/tests/registration_tests.rs

#[cfg(test)]
mod tests {
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coin, coins, from_json, Addr};

    use crate::contract::{execute, query};
    use crate::error::ContractError;
    use crate::msg::{ExecuteMsg, GetDIDResponse, QueryMsg};
    use crate::state::Config;
    use crate::tests::common::common::{
        assert_config_state, assert_name_owner, get_deps, mock_alice_registers_name, mock_init_no_price, mock_init_with_price
    };

    #[test]
    fn proper_init_no_fees() {
        let mut deps_empty = mock_dependencies();

        let deps = get_deps(&mut deps_empty);
        mock_init_no_price(deps);

        let deps = get_deps(&mut deps_empty);
        assert_config_state(
            deps.as_ref(),
            Config {
                owner: Addr::unchecked("creator"),
                did_register_price: None,
            },
        );
    }

    #[test]
    fn proper_init_with_fees() {
        let mut deps_empty = mock_dependencies();

        let deps = get_deps(&mut deps_empty);
        mock_init_with_price(deps, coin(3, "token"), coin(4, "token"));

        let deps = get_deps(&mut deps_empty);
        assert_config_state(
            deps.as_ref(),
            Config {
                owner: Addr::unchecked("creator"),
                did_register_price: Some(coin(3, "token")),
            },
        );
    }

    #[test]
    fn register_available_name_and_query_works() {
        let mut deps_empty = mock_dependencies();
        let deps = get_deps(&mut deps_empty);
        mock_init_no_price(deps);
        let deps = get_deps(&mut deps_empty);
        mock_alice_registers_name(deps, &[]);

        // querying for name resolves to correct address
        let deps = get_deps(&mut deps_empty);
        assert_name_owner(deps.as_ref(), "alice", &Addr::unchecked("alice_key"));
    }

    #[test]
    fn register_available_name_and_query_works_with_fees() {
        let mut deps_empty = mock_dependencies();
        let deps = get_deps(&mut deps_empty);
        mock_init_with_price(deps, coin(2, "token"), coin(2, "token"));
        let deps = get_deps(&mut deps_empty);
        mock_alice_registers_name(deps, &coins(2, "token"));

        // anyone can register an available name with more fees than needed
        let info = mock_info("bob_key", &coins(5, "token"));
        let msg = ExecuteMsg::Register {
            username: "bob".to_string(),
            did: "awesome_did".to_string(),
        };

        let deps = get_deps(&mut deps_empty);
        let _res = execute(deps, mock_env(), info, msg)
            .expect("contract successfully handles Register message");

        // querying for name resolves to correct address
        let deps = get_deps(&mut deps_empty);
        assert_name_owner(deps.as_ref(), "alice", &Addr::unchecked("alice_key"));
        assert_name_owner(deps.as_ref(), "bob", &Addr::unchecked("bob_key"));
    }

    #[test]
    fn register_and_remove_available_name() {
        let mut deps_empty = mock_dependencies();
        let deps = get_deps(&mut deps_empty);
        mock_init_with_price(deps, coin(2, "token"), coin(2, "token"));
        let deps = get_deps(&mut deps_empty);
        mock_alice_registers_name(deps, &coins(2, "token"));

        // try removing Alice's DID
        let msg = ExecuteMsg::RemoveDID {
            username: "alice".to_string(),
            did: "alice_did".to_string(),
        };

        // Bob shouldn't be able to do it
        let bob_info = mock_info("bob_key", &coins(5, "token"));
        let deps = get_deps(&mut deps_empty);
        let res = execute(deps, mock_env(), bob_info, msg.clone());
        assert!(res.is_err());

        // Alice should be able to remove her DID
        let alice_info = mock_info("alice_key", &coins(5, "token"));
        let deps = get_deps(&mut deps_empty);
        let _res = execute(deps, mock_env(), alice_info, msg)
            .expect("error removing user's DID");

        // confirming Alice's DID is gone
        let read_msg = QueryMsg::GetUsernameDID {
            username: "alice".to_string(),
        };
        let deps = get_deps(&mut deps_empty);
        let read_res = query(deps.as_ref(), mock_env(), read_msg).ok().unwrap();
        let value: GetDIDResponse = from_json(&read_res).unwrap();

        assert!(value.did_info.is_none(), "DID not removed from storage");
    }

    #[test]
    fn fails_on_register_already_taken_name() {
        let mut deps_empty = mock_dependencies();
        let deps = get_deps(&mut deps_empty);
        mock_init_no_price(deps);
        let deps = get_deps(&mut deps_empty);
        mock_alice_registers_name(deps, &[]);

        // bob can't register the same name
        let info = mock_info("bob_key", &coins(2, "token"));
        let msg = ExecuteMsg::Register {
            username: "alice".to_string(),
            did: "awesome_did".to_string(),
        };
        let deps = get_deps(&mut deps_empty);
        let res = execute(deps, mock_env(), info, msg);

        match res {
            Ok(_) => panic!("Must return error"),
            Err(ContractError::NameTaken { .. }) => {}
            Err(_) => panic!("Unknown error"),
        }
        // alice can't register the same name again
        let info = mock_info("alice_key", &coins(2, "token"));
        let msg = ExecuteMsg::Register {
            username: "alice".to_string(),
            did: "awesome_did".to_string(),
        };
        let deps = get_deps(&mut deps_empty);
        let res = execute(deps, mock_env(), info, msg);

        match res {
            Ok(_) => panic!("Must return error"),
            Err(ContractError::NameTaken { .. }) => {}
            Err(e) => panic!("Unexpected error: {:?}", e),
        }
    }

    #[test]
    fn register_available_name_fails_with_invalid_name() {
        let mut deps_empty = mock_dependencies();
        let deps = get_deps(&mut deps_empty);
        mock_init_no_price(deps);
        let info = mock_info("bob_key", &coins(2, "token"));

        // hi is too short
        let msg = ExecuteMsg::Register {
            username: "hi".to_string(),
            did: "short_did".to_string(),
        };
        let deps = get_deps(&mut deps_empty);
        match execute(deps, mock_env(), info.clone(), msg) {
            Ok(_) => panic!("Must return error"),
            Err(ContractError::NameTooShort { .. }) => {}
            Err(_) => panic!("Unknown error"),
        }

        // 65 chars is too long
        let msg = ExecuteMsg::Register {
            username: "01234567890123456789012345678901234567890123456789012345678901234"
                .to_string(),
            did: "long_did".to_string(),
        };
        let deps = get_deps(&mut deps_empty);
        match execute(deps, mock_env(), info.clone(), msg) {
            Ok(_) => panic!("Must return error"),
            Err(ContractError::NameTooLong { .. }) => {}
            Err(_) => panic!("Unknown error"),
        }

        // no special characters
        let msg = ExecuteMsg::Register {
            username: "ALI+CE".to_string(),
            did: "LOUDDID".to_string(),
        };
        let deps = get_deps(&mut deps_empty);
        match execute(deps, mock_env(), info.clone(), msg) {
            Ok(_) => panic!("Must return error"),
            Err(ContractError::InvalidCharacter { c }) => assert_eq!(c, '+'),
            Err(_) => panic!("Unknown error"),
        }
        // ... or spaces
        let msg = ExecuteMsg::Register {
            username: "two words".to_string(),
            did: "D   I    D".to_string(),
        };
        let deps = get_deps(&mut deps_empty);
        match execute(deps, mock_env(), info, msg) {
            Ok(_) => panic!("Must return error"),
            Err(ContractError::InvalidCharacter { .. }) => {}
            Err(_) => panic!("Unknown error"),
        }
    }

    #[test]
    fn fails_on_register_insufficient_fees() {
        let mut deps_empty = mock_dependencies();
        let deps = get_deps(&mut deps_empty);
        mock_init_with_price(deps, coin(2, "token"), coin(2, "token"));

        // anyone can register an available name with sufficient fees
        let info = mock_info("alice_key", &[]);
        let msg = ExecuteMsg::Register {
            did: "brokealice".to_string(),
            username: "awesomedid".to_string(),
        };

        let deps = get_deps(&mut deps_empty);
        let res = execute(deps, mock_env(), info, msg);

        match res {
            Ok(_) => panic!("register call should fail with insufficient fees"),
            Err(ContractError::InsufficientFundsSend {}) => {}
            Err(e) => panic!("Unexpected error: {:?}", e),
        }
    }

    #[test]
    fn fails_on_register_wrong_fee_denom() {
        let mut deps_empty = mock_dependencies();
        let deps = get_deps(&mut deps_empty);
        mock_init_with_price(deps, coin(2, "token"), coin(2, "token"));

        // anyone can register an available name with sufficient fees
        let info = mock_info("alice_key", &coins(2, "earth"));
        let msg = ExecuteMsg::Register {
            username: "wrongalice".to_string(),
            did: "awesomedid".to_string(),
        };

        let deps = get_deps(&mut deps_empty);
        let res = execute(deps, mock_env(), info, msg);

        match res {
            Ok(_) => panic!("register call should fail with insufficient fees"),
            Err(ContractError::InsufficientFundsSend {}) => {}
            Err(e) => panic!("Unexpected error: {:?}", e),
        }
    }

    #[test]
    fn returns_empty_on_query_unregistered_name() {
        let mut deps_empty = mock_dependencies();

        let deps = get_deps(&mut deps_empty);
        mock_init_no_price(deps);

        // querying for unregistered name results in NotFound error
        let deps = get_deps(&mut deps_empty);
        let res = query(
            deps.as_ref(),
            mock_env(),
            QueryMsg::GetUsernameDID {
                username: "alice".to_string(),
            },
        )
        .unwrap();
        let value: GetDIDResponse = from_json(&res).unwrap();
        assert_eq!(None, value.did_info);
    }
}
