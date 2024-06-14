// src/tests/common.rs

#[cfg(test)]
pub mod common {
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{coin, coins, from_binary, Addr, Coin, Deps, DepsMut};

    use crate::contract::{execute, instantiate, query};
    use crate::error::ContractError;
    use crate::msg::{ExecuteMsg, GetDIDResponse, InstantiateMsg, QueryMsg};
    use crate::state::{username_storage, Config, USERNAME_RESOLVER_KEY};

    pub fn assert_name_owner(deps: Deps, name: &str, owner: &Addr) {
        let res = query(
            deps,
            mock_env(),
            QueryMsg::GetUsernameDID {
                username: name.to_string(),
            },
        )
        .unwrap();

        let value: GetDIDResponse = from_binary(&res).unwrap();
        assert_eq!(
            Some(owner.to_string()),
            Some(value.did_info.unwrap().wallet.to_string())
        );
    }

    pub fn assert_config_state(deps: Deps, expected: Config) {
        let res = query(deps, mock_env(), QueryMsg::Config {}).unwrap();
        let value: Config = from_binary(&res).unwrap();
        assert_eq!(value, expected);
    }

    pub fn mock_init_with_price(deps: DepsMut, purchase_price: Coin, transfer_price: Coin) {
        let msg = InstantiateMsg {
            purchase_price: Some(purchase_price),
            transfer_price: Some(transfer_price),
        };

        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps, mock_env(), info, msg)
            .expect("contract successfully handles InstantiateMsg");
    }

    pub fn mock_init_no_price(deps: DepsMut) {
        let msg = InstantiateMsg {
            purchase_price: None,
            transfer_price: None,
        };

        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps, mock_env(), info, msg)
            .expect("contract successfully handles InstantiateMsg");
    }

    pub fn mock_alice_registers_name(deps: DepsMut, sent: &[Coin]) {
        // alice can register an available name
        let info = mock_info("alice_key", sent);
        let msg = ExecuteMsg::Register {
            username: "alice".to_string(),
            did: "alice_did".to_string(),
        };
        let _res = execute(deps, mock_env(), info, msg)
            .expect("contract successfully handles Register message");
    }
}
