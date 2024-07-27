// src/tests/common.rs

#[cfg(test)]
pub mod common {
    use coreum_wasm_sdk::core::CoreumQueries;
    use cosmwasm_std::testing::{mock_env, mock_info, MockApi, MockQuerier, MockStorage};
    use cosmwasm_std::{coins, from_json, Addr, Coin, Deps, DepsMut, Empty, OwnedDeps, QuerierWrapper};

    use crate::contract::{execute, instantiate, query};
    use crate::msg::{ExecuteMsg, GetDIDResponse, InstantiateMsg, QueryMsg};
    use crate::state::Config;

    // pub struct DepsMutCoreum<'a> {
    //     deps: DepsMut<'a, CoreumQueries>
    // }

    // impl<'a> DepsMutCoreum<'a> {

    //     pub fn new() -> Self {
    //         DepsMutCoreum {
    //             deps: mock_dependencies()
    //         }
    //     }


    //     pub fn get_mut(&mut self) -> Self {
    //         let mut deps_empty = Box::new(mock_dependencies());
    //         DepsMutCoreum {
    //             deps: DepsMut {
    //                 storage: &mut self.deps.storage,
    //                 api: &self.deps.api,
    //                 querier: QuerierWrapper::new(&self.deps.querier),
    //             }
    //         }
    //     }
    // }

    // impl Clone for DepsMutCoreum<'_> {
    //     fn clone(&self) -> Self {
    //         Self { deps: self.deps.clone() }
    //     }
    // }

    pub fn get_deps<'a>(deps_empty: &'a mut OwnedDeps<MockStorage, MockApi, MockQuerier, Empty>) -> DepsMut<'a, CoreumQueries> {
        DepsMut {
            storage: &mut deps_empty.storage,
            api: &deps_empty.api,
            querier: QuerierWrapper::new(&deps_empty.querier),
        }
    }

    pub fn assert_name_owner(deps: Deps<CoreumQueries>, name: &str, owner: &Addr) {
        let res = query(
            deps,
            mock_env(),
            QueryMsg::GetUsernameDID {
                username: name.to_string(),
            },
        )
        .unwrap();

        let value: GetDIDResponse = from_json(&res).unwrap();
        assert_eq!(
            Some(owner.to_string()),
            Some(value.did_info.unwrap().wallet.to_string())
        );
    }

    pub fn assert_config_state(deps: Deps<CoreumQueries>, expected: Config) {
        let res = query(deps, mock_env(), QueryMsg::Config {}).unwrap();
        let value: Config = from_json(&res).unwrap();
        assert_eq!(value, expected);
    }

    pub fn mock_init_with_price(deps: DepsMut<CoreumQueries>, purchase_price: Coin, transfer_price: Coin) {
        let msg = InstantiateMsg {
            purchase_price: Some(purchase_price),
            transfer_price: Some(transfer_price),
        };

        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps, mock_env(), info, msg)
            .expect("contract successfully handles InstantiateMsg");
    }

    pub fn mock_init_no_price(deps: DepsMut<CoreumQueries>) {
        let msg = InstantiateMsg {
            purchase_price: None,
            transfer_price: None,
        };

        let info = mock_info("creator", &coins(2, "token"));
        let _res = instantiate(deps, mock_env(), info, msg)
            .expect("contract successfully handles InstantiateMsg");
    }

    pub fn mock_register(deps: DepsMut<CoreumQueries>, name: &str, sent: &[Coin]) {
        // alice can register an available name
        let info = mock_info(format!("{}_key", name).as_str(), sent);
        let msg = ExecuteMsg::Register {
            username: format!("{}", name).as_str().to_string(),
            did: format!("{}_did", name).as_str().to_string(),
        };
        let _res = execute(deps, mock_env(), info, msg)
            .expect("contract successfully handles Register message");
    }

    pub fn mock_alice_registers_name(deps: DepsMut<CoreumQueries>, sent: &[Coin]) {
        mock_register(deps, &"alice", sent)
    }
}
