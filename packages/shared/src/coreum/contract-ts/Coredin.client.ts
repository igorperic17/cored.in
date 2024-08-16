/**
* This file was automatically generated by @cosmwasm/ts-codegen@1.9.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee } from "@cosmjs/amino";
import { Uint128, Decimal, InstantiateMsg, Coin, ExecuteMsg, Uint64, QueryMsg, Addr, Config, GetDIDResponse, DidInfo, GetMerkleRootResponse, GetSubscribersResponse, Timestamp, GetSubscriptionInfoResponse, SubscriptionInfo, Boolean } from "./Coredin.types";
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
  getMerkleRoot: ({
    did
  }: {
    did: string;
  }) => Promise<GetMerkleRootResponse>;
  verifyCredential: ({
    credentialHash,
    did,
    merkleProofs
  }: {
    credentialHash: string;
    did: string;
    merkleProofs: string[];
  }) => Promise<Boolean>;
  isSubscriber: ({
    subscriberWallet,
    targetDid
  }: {
    subscriberWallet: string;
    targetDid: string;
  }) => Promise<Boolean>;
  getSubscriptionPrice: ({
    did
  }: {
    did: string;
  }) => Promise<Coin>;
  getSubscriptionDuration: ({
    did
  }: {
    did: string;
  }) => Promise<Uint64>;
  getSubscriptionInfo: ({
    did,
    subscriber
  }: {
    did: string;
    subscriber: string;
  }) => Promise<GetSubscriptionInfoResponse>;
  getSubscriberList: ({
    did,
    page,
    pageSize
  }: {
    did: string;
    page: Uint64;
    pageSize: Uint64;
  }) => Promise<GetSubscribersResponse>;
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
    this.getMerkleRoot = this.getMerkleRoot.bind(this);
    this.verifyCredential = this.verifyCredential.bind(this);
    this.isSubscriber = this.isSubscriber.bind(this);
    this.getSubscriptionPrice = this.getSubscriptionPrice.bind(this);
    this.getSubscriptionDuration = this.getSubscriptionDuration.bind(this);
    this.getSubscriptionInfo = this.getSubscriptionInfo.bind(this);
    this.getSubscriberList = this.getSubscriberList.bind(this);
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
  getMerkleRoot = async ({
    did
  }: {
    did: string;
  }): Promise<GetMerkleRootResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_merkle_root: {
        did
      }
    });
  };
  verifyCredential = async ({
    credentialHash,
    did,
    merkleProofs
  }: {
    credentialHash: string;
    did: string;
    merkleProofs: string[];
  }): Promise<Boolean> => {
    return this.client.queryContractSmart(this.contractAddress, {
      verify_credential: {
        credential_hash: credentialHash,
        did,
        merkle_proofs: merkleProofs
      }
    });
  };
  isSubscriber = async ({
    subscriberWallet,
    targetDid
  }: {
    subscriberWallet: string;
    targetDid: string;
  }): Promise<Boolean> => {
    return this.client.queryContractSmart(this.contractAddress, {
      is_subscriber: {
        subscriber_wallet: subscriberWallet,
        target_did: targetDid
      }
    });
  };
  getSubscriptionPrice = async ({
    did
  }: {
    did: string;
  }): Promise<Coin> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_subscription_price: {
        did
      }
    });
  };
  getSubscriptionDuration = async ({
    did
  }: {
    did: string;
  }): Promise<Uint64> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_subscription_duration: {
        did
      }
    });
  };
  getSubscriptionInfo = async ({
    did,
    subscriber
  }: {
    did: string;
    subscriber: string;
  }): Promise<GetSubscriptionInfoResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_subscription_info: {
        did,
        subscriber
      }
    });
  };
  getSubscriberList = async ({
    did,
    page,
    pageSize
  }: {
    did: string;
    page: Uint64;
    pageSize: Uint64;
  }): Promise<GetSubscribersResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_subscriber_list: {
        did,
        page,
        page_size: pageSize
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
  removeDID: ({
    did,
    username
  }: {
    did: string;
    username: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  updateCredentialMerkleRoot: ({
    did,
    root
  }: {
    did: string;
    root: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  setSubscription: ({
    duration,
    price
  }: {
    duration: Uint64;
    price: Coin;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  subscribe: ({
    did
  }: {
    did: string;
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
    this.removeDID = this.removeDID.bind(this);
    this.updateCredentialMerkleRoot = this.updateCredentialMerkleRoot.bind(this);
    this.setSubscription = this.setSubscription.bind(this);
    this.subscribe = this.subscribe.bind(this);
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
  removeDID = async ({
    did,
    username
  }: {
    did: string;
    username: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      remove_d_i_d: {
        did,
        username
      }
    }, fee, memo, _funds);
  };
  updateCredentialMerkleRoot = async ({
    did,
    root
  }: {
    did: string;
    root: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      update_credential_merkle_root: {
        did,
        root
      }
    }, fee, memo, _funds);
  };
  setSubscription = async ({
    duration,
    price
  }: {
    duration: Uint64;
    price: Coin;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      set_subscription: {
        duration,
        price
      }
    }, fee, memo, _funds);
  };
  subscribe = async ({
    did
  }: {
    did: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      subscribe: {
        did
      }
    }, fee, memo, _funds);
  };
}