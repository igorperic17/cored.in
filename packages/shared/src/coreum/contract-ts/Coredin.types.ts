/**
* This file was automatically generated by @cosmwasm/ts-codegen@1.9.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export type Uint128 = string;
export type Decimal = string;
export interface InstantiateMsg {
  purchase_price?: Coin | null;
  subscription_fee: Decimal;
  transfer_price?: Coin | null;
}
export interface Coin {
  amount: Uint128;
  denom: string;
}
export type ExecuteMsg = {
  register: {
    did: string;
    username: string;
  };
} | {
  remove_d_i_d: {
    did: string;
    username: string;
  };
} | {
  update_credential_merkle_root: {
    did: string;
    root: string;
  };
} | {
  set_subscription: {
    duration: Uint64;
    price: Coin;
  };
} | {
  subscribe: {
    did: string;
  };
};
export type Uint64 = string;
export type QueryMsg = {
  config: {};
} | {
  get_wallet_d_i_d: {
    wallet: string;
  };
} | {
  get_username_d_i_d: {
    username: string;
  };
} | {
  get_d_i_d: {
    did: string;
  };
} | {
  get_merkle_root: {
    did: string;
  };
} | {
  verify_credential: {
    credential_hash: string;
    did: string;
    merkle_proofs: string[];
  };
} | {
  is_subscriber: {
    subscriber_wallet: string;
    target_did: string;
  };
} | {
  get_subscription_price: {
    did: string;
  };
} | {
  get_subscription_duration: {
    did: string;
  };
} | {
  get_subscription_info: {
    did: string;
    subscriber: string;
  };
} | {
  get_subscribers: {
    page: Uint64;
    page_size: Uint64;
    wallet: string;
  };
} | {
  get_subscriptions: {
    page: Uint64;
    page_size: Uint64;
    wallet: string;
  };
} | {
  get_subscriber_count: {
    wallet: string;
  };
};
export type Addr = string;
export interface Config {
  did_register_price?: Coin | null;
  owner: Addr;
  subscription_fee: Decimal;
}
export type Timestamp = Uint64;
export interface GetDIDResponse {
  did_info?: ProfileInfo | null;
}
export interface ProfileInfo {
  did: string;
  subscriber_count: Uint64;
  subscription_duration_days?: Uint64 | null;
  subscription_price?: Coin | null;
  top_subscribers: SubscriptionInfo[];
  username: string;
  wallet: Addr;
}
export interface SubscriptionInfo {
  cost: Coin;
  subscribed_to: string;
  subscribed_to_wallet: Addr;
  subscriber: string;
  subscriber_wallet: Addr;
  valid_until: Timestamp;
}
export interface GetMerkleRootResponse {
  root?: string | null;
}
export interface GetSubscriptionListResponse {
  subscribers: SubscriptionInfo[];
}
export interface GetSubscriptionInfoResponse {
  info?: SubscriptionInfo | null;
}
export type Boolean = boolean;