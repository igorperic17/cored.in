use coreum_wasm_sdk::core::CoreumMsg;
use cosmwasm_std::{to_json_binary, BankMsg, Binary, Coin, Decimal, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult, Uint128, Uint64};

use crate::{contract::FEE_DENOM, error::ContractError, models::post::PostInfo, state::POST};
pub fn tip_post_author(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    post_info: PostInfo,
) -> Result<Response<CoreumMsg>, ContractError> {
    let key = post_info.id.clone();
    let post = POST.may_load(deps.storage, key.clone())?;

    // Ensure there's a payment sent
    if info.clone().funds.is_empty() {
        return Err(ContractError::NoFunds {});
    }

    let mut post_info = if let Some(post_info) = post {
        post_info
    } else {
        // If post is not found, create a new post on the chain
        // copy everything from the payload exept the vault - force that to 0
        let new_post_info = PostInfo {
            id: post_info.id,
            hash: post_info.hash, // Assuming a default hash for simplicity
            author: post_info.author,
            post_type: post_info.post_type,
            created_on: post_info.created_on,
            vault: Coin {
                denom: FEE_DENOM.to_string(),
                amount: Uint128::zero(),
            },
        };
        new_post_info
    };

    let author_wallet = post_info.author.clone();

    // Calculate 5% commission
    let commission_rate = Decimal::percent(5);
    let total_tip = info.funds[0].amount.clone(); // Assuming single coin type
    let commission = total_tip * commission_rate;
    let author_tip = total_tip - commission;

    // Create bank messages for commission and author tip
    let commission_msg = BankMsg::Send {
        to_address: env.contract.address.to_string(),
        amount: vec![Coin {
            denom: info.funds[0].denom.clone(),
            amount: commission,
        }],
    };

    let author_msg = BankMsg::Send {
        to_address: author_wallet.to_string(),
        amount: vec![Coin {
            denom: info.funds[0].denom.clone(),
            amount: author_tip,
        }],
    };

    post_info.vault.amount += author_tip;
    POST.save(deps.storage, key.clone(), &post_info)?;

    Ok(Response::new()
        .add_message(commission_msg)
        .add_message(author_msg)
        .add_attribute("action", "tip_post_author")
        .add_attribute("post_id", post_info.id)
        .add_attribute("recipient", author_wallet)
        .add_attribute("commission", commission.to_string())
        .add_attribute("author_tip", author_tip.to_string()))
}

pub fn get_post_tips(deps: Deps, post_id: Uint64) -> StdResult<Binary> {
    let post = POST.may_load(deps.storage, post_id.clone().to_string())?;

    if let Some(post) = post {
        Ok(to_json_binary(&post.vault.amount)?)
    } else {
        Err(StdError::not_found(format!("Post with id {} not found", post_id)))
    }
}

#[cfg(test)]
mod tests {
    use cosmwasm_std::{
        testing::{mock_dependencies, mock_env, mock_info},
        Addr, Uint128,
    };

    use super::*;
    use crate::models::post::{PostInfo, PostType};

    #[test]
    fn test_tip_post_author_success() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let post_id = "test_post_1".to_string();
        let author = Addr::unchecked("author_address");
        let tipper = Addr::unchecked("tipper_address");

        // Setup a mock post
        let post_info = PostInfo {
            id: post_id.clone(),
            hash: "test_hash".to_string(),
            author: author.clone(),
            post_type: PostType::Microblog,
            created_on: env.block.time,
            vault: Coin {
                denom: FEE_DENOM.to_string(),
                amount: Uint128::zero(),
            },
        };
        POST.save(deps.as_mut().storage, post_id.clone(), &post_info)
            .unwrap();

        // Setup the tip
        let tip_amount = Uint128::new(100);
        let info = mock_info(
            tipper.as_str(),
            &[Coin {
                denom: FEE_DENOM.to_string(),
                amount: tip_amount,
            }],
        );

        // Execute the tip
        let res = tip_post_author(deps.as_mut(), env.clone(), info, post_info.clone()).unwrap();

        // Check the response
        assert_eq!(res.messages.len(), 2);
        assert_eq!(res.attributes.len(), 5);

        // Check commission and author tip calculations
        let commission = tip_amount * Decimal::percent(5);
        let author_tip = tip_amount - commission;

        assert_eq!(res.attributes[3].value, commission.to_string());
        assert_eq!(res.attributes[4].value, author_tip.to_string());
    }

    #[test]
    fn test_tip_post_author_no_funds() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let post_id = "test_post_2".to_string();
        let author = Addr::unchecked("author_address");
        let tipper = Addr::unchecked("tipper_address");

        // Setup a mock post
        let post_info = PostInfo {
            id: post_id.clone(),
            hash: "test_hash".to_string(),
            author: author.clone(),
            post_type: PostType::Microblog,
            created_on: env.block.time,
            vault: Coin {
                denom: FEE_DENOM.to_string(),
                amount: Uint128::zero(),
            },
        };
        POST.save(deps.as_mut().storage, post_id.clone(), &post_info)
            .unwrap();

        // Setup the tip with no funds
        let info = mock_info(tipper.as_str(), &[]);

        // Execute the tip
        let err = tip_post_author(deps.as_mut(), env.clone(), info, post_info.clone()).unwrap_err();

        // Check the error
        assert!(matches!(err, ContractError::NoFunds {}));
    }

    #[test]
    fn test_tip_post_author_post_not_found() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let post_id = "non_existent_post".to_string();
        let tipper = Addr::unchecked("tipper_address");

        // Setup the tip
        let tip_amount = Uint128::new(100);
        let info = mock_info(
            tipper.as_str(),
            &[Coin {
                denom: FEE_DENOM.to_string(),
                amount: tip_amount,
            }],
        );

        // Execute the tip
        let res = tip_post_author(
            deps.as_mut(),
            env.clone(),
            info,
            PostInfo {
                id: post_id.clone(),
                hash: "test_hash".to_string(),
                author: Addr::unchecked("author_address"),
                post_type: PostType::Microblog,
                created_on: env.block.time,
                vault: Coin {
                    denom: FEE_DENOM.to_string(),
                    amount: Uint128::zero(),
                },
            },
        )
        .unwrap();

        // Check the response
        assert_eq!(res.messages.len(), 2); // One for commission, one for author tip
        assert_eq!(res.attributes.len(), 5); // action, post_id, recipient, commission, author_tip
    }

    #[test]
    fn test_tip_post_author_post_exists() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let post_id = "existing_post".to_string();
        let tipper = Addr::unchecked("tipper_address");

        // Setup a mock post
        let post_info = PostInfo {
            id: post_id.clone(),
            hash: "test_hash".to_string(),
            author: Addr::unchecked("author_address"),
            post_type: PostType::Microblog,
            created_on: env.block.time,
            vault: Coin {
                denom: FEE_DENOM.to_string(),
                amount: Uint128::zero(),
            },
        };
        POST.save(deps.as_mut().storage, post_id.clone(), &post_info)
            .unwrap();

        // Setup the tip
        let tip_amount = Uint128::new(100);
        let info = mock_info(
            tipper.as_str(),
            &[Coin {
                denom: FEE_DENOM.to_string(),
                amount: tip_amount,
            }],
        );

        // Execute the tip
        let res = tip_post_author(deps.as_mut(), env.clone(), info, post_info.clone()).unwrap();

        // Check the response
        assert_eq!(res.messages.len(), 2); // One for commission, one for author tip
        assert_eq!(res.attributes.len(), 5); // action, post_id, recipient, commission, author_tip
    }

    #[test]
    fn test_tip_post_author_post_doesnt_exist() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let post_id = "non_existent_post".to_string();
        let tipper = Addr::unchecked("tipper_address");

        // Setup the tip
        let tip_amount = Uint128::new(100);
        let info = mock_info(
            tipper.as_str(),
            &[Coin {
                denom: FEE_DENOM.to_string(),
                amount: tip_amount,
            }],
        );

        // Execute the tip
        let res = tip_post_author(
            deps.as_mut(),
            env.clone(),
            info,
            PostInfo {
                id: post_id.clone(),
                hash: "test_hash".to_string(),
                author: Addr::unchecked("author_address"),
                post_type: PostType::Microblog,
                created_on: env.block.time,
                vault: Coin {
                    denom: FEE_DENOM.to_string(),
                    amount: Uint128::zero(),
                },
            },
        )
        .unwrap();

        // Check the response
        assert_eq!(res.messages.len(), 2); // One for commission, one for author tip
        assert_eq!(res.attributes.len(), 5); // action, post_id, recipient, commission, author_tip
    }

    #[test]
    fn test_get_post_tips() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let post_id = "test_post_tips".to_string();

        // Setup a mock post with tips
        let post_info = PostInfo {
            id: post_id.clone(),
            hash: "test_hash".to_string(),
            author: Addr::unchecked("author_address"),
            post_type: PostType::Microblog,
            created_on: env.block.time,
            vault: Coin {
                denom: FEE_DENOM.to_string(),
                amount: Uint128::new(100), // Assuming 100 ucore as the tip amount
            },
        };
        POST.save(deps.as_mut().storage, post_id.clone(), &post_info)
            .unwrap();

        // Test getting tips for an existing post
        let tips = get_post_tips(deps.as_ref(), post_id.clone()).unwrap();
        assert_eq!(tips.len(), 1);
        assert_eq!(tips[0].denom, FEE_DENOM.to_string());
        assert_eq!(tips[0].amount, Uint128::new(100));

        // Test getting tips for a non-existing post
        let non_existent_post_id = "non_existent_post_tips".to_string();
        let err = get_post_tips(deps.as_ref(), non_existent_post_id.clone()).unwrap_err();
        assert!(matches!(
            err,
            ContractError::PostNotFound {
                ref id
            } if id == &non_existent_post_id
        ));
    }

    #[test]
    fn test_get_post_tips_with_commission() {
        let mut deps = mock_dependencies();
        let env = mock_env();
        let info = mock_info("tipper", &[]);
        let post_id = "test_post_tips_commission".to_string();

        // Setup a mock post without initial tips
        let post_info = PostInfo {
            id: post_id.clone(),
            hash: "test_hash".to_string(),
            author: Addr::unchecked("author_address"),
            post_type: PostType::Microblog,
            created_on: env.block.time,
            vault: Coin {
                denom: FEE_DENOM.to_string(),
                amount: Uint128::zero(),
            },
        };
        POST.save(deps.as_mut().storage, post_id.clone(), &post_info).unwrap();

        // Simulate tipping process using the tip_post_author function
        let tip_amount = Uint128::new(1000); // 10 tokens
        let tip_info = MessageInfo {
            sender: info.sender,
            funds: vec![Coin {
                denom: FEE_DENOM.to_string(),
                amount: tip_amount,
            }],
        };

        let res = tip_post_author(deps.as_mut(), env.clone(), tip_info, post_info.clone()).unwrap();

        // Verify that the tip_post_author function executed successfully
        assert_eq!(res.messages.len(), 2); // One for commission, one for author tip

        // Test getting tips for the post
        let tips = get_post_tips(deps.as_ref(), post_id).unwrap();
        assert_eq!(tips.len(), 1);
        assert_eq!(tips[0].denom, FEE_DENOM.to_string());
        
        // The total tips should be the tip amount minus the 5% commission
        let expected_tip = tip_amount * Decimal::percent(95);
        assert_eq!(tips[0].amount, expected_tip);
        
        // Verify that the total tips are indeed 9.5 tokens (950 units)
        assert_eq!(tips[0].amount, Uint128::new(950));
    }
}
