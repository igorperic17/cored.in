/**
* This file was automatically generated by @cosmwasm/ts-codegen@1.9.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee } from "@cosmjs/amino";
import { Uint128, InstantiateMsg, Coin, ExecuteMsg, QueryMsg, Addr, Config, GetDIDResponse, DidInfo } from "./Coredin.types";
export interface CoredinReadOnlyInterface {
  contractAddress: string;
  config: () => Promise<Config>;
  getWalletDID: ({
    wallet
  }: {
    wallet: string;
  }) => Promise<GetDIDResponse>;
  getUsernameDID: ({
    username
  }: {
    username: string;
  }) => Promise<GetDIDResponse>;
  getDID: ({
    did
  }: {
    did: string;
  }) => Promise<GetDIDResponse>;
}
export class CoredinQueryClient implements CoredinReadOnlyInterface {
  client: CosmWasmClient;
  contractAddress: string;
  constructor(client: CosmWasmClient, contractAddress: string) {
    this.client = client;
    this.contractAddress = contractAddress;
    this.config = this.config.bind(this);
    this.getWalletDID = this.getWalletDID.bind(this);
    this.getUsernameDID = this.getUsernameDID.bind(this);
    this.getDID = this.getDID.bind(this);
  }
  config = async (): Promise<Config> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {}
    });
  };
  getWalletDID = async ({
    wallet
  }: {
    wallet: string;
  }): Promise<GetDIDResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_wallet_d_i_d: {
        wallet
      }
    });
  };
  getUsernameDID = async ({
    username
  }: {
    username: string;
  }): Promise<GetDIDResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_username_d_i_d: {
        username
      }
    });
  };
  getDID = async ({
    did
  }: {
    did: string;
  }): Promise<GetDIDResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_d_i_d: {
        did
      }
    });
  };
}
export interface CoredinInterface extends CoredinReadOnlyInterface {
  contractAddress: string;
  sender: string;
  register: ({
    did,
    username
  }: {
    did: string;
    username: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
}
export class CoredinClient extends CoredinQueryClient implements CoredinInterface {
  client: SigningCosmWasmClient;
  sender: string;
  contractAddress: string;
  constructor(client: SigningCosmWasmClient, sender: string, contractAddress: string) {
    super(client, contractAddress);
    this.client = client;
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.register = this.register.bind(this);
  }
  register = async ({
    did,
    username
  }: {
    did: string;
    username: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      register: {
        did,
        username
      }
    }, fee, memo, _funds);
  };
}