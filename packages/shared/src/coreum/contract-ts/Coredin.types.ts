/**
* This file was automatically generated by @cosmwasm/ts-codegen@1.9.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export type Uint128 = string;
export interface InstantiateMsg {
  purchase_price?: Coin | null;
  transfer_price?: Coin | null;
  [k: string]: unknown;
}
export interface Coin {
  amount: Uint128;
  denom: string;
  [k: string]: unknown;
}
export type ExecuteMsg = {
  register: {
    did: string;
    username: string;
    [k: string]: unknown;
  };
};
export type QueryMsg = {
  config: {
    [k: string]: unknown;
  };
} | {
  get_wallet_d_i_d: {
    wallet: string;
    [k: string]: unknown;
  };
} | {
  get_username_d_i_d: {
    username: string;
    [k: string]: unknown;
  };
} | {
  get_d_i_d: {
    did: string;
    [k: string]: unknown;
  };
};
export type Addr = string;
export interface Config {
  did_register_price?: Coin | null;
  owner: Addr;
  [k: string]: unknown;
}
export interface GetDIDResponse {
  did_info?: DidInfo | null;
  [k: string]: unknown;
}
export interface DidInfo {
  did: string;
  username: string;
  wallet: Addr;
  [k: string]: unknown;
}