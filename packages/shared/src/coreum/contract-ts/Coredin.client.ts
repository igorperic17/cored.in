/**
* This file was automatically generated by @cosmwasm/ts-codegen@1.9.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { CosmWasmClient, SigningCosmWasmClient, ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { StdFee } from "@cosmjs/amino";
import { Uint128, Decimal, InstantiateMsg, Coin, ExecuteMsg, Uint64, DID, QueryMsg, Addr, Config, Timestamp, GetDIDResponse, ProfileInfo, SubscriptionInfo, GetMerkleRootResponse, GetSubscriptionListResponse, NullableSubscriptionInfo, Boolean } from "./Coredin.types";
export interface CoredinReadOnlyInterface {
  contractAddress: string;
  config: () => Promise<Config>;
  getWalletDID: ({
    wallet
  }: {
    wallet: Addr;
  }) => Promise<GetDIDResponse>;
  getUsernameDID: ({
    username
  }: {
    username: string;
  }) => Promise<GetDIDResponse>;
  getDID: ({
    did
  }: {
    did: DID;
  }) => Promise<GetDIDResponse>;
  getMerkleRoot: ({
    did
  }: {
    did: DID;
  }) => Promise<GetMerkleRootResponse>;
  verifyCredential: ({
    credentialHash,
    did,
    merkleProofs
  }: {
    credentialHash: string;
    did: DID;
    merkleProofs: string[];
  }) => Promise<Boolean>;
  isSubscriber: ({
    subscriberWallet,
    targetDid
  }: {
    subscriberWallet: Addr;
    targetDid: DID;
  }) => Promise<Boolean>;
  getSubscriptionPrice: ({
    did
  }: {
    did: DID;
  }) => Promise<Coin>;
  getSubscriptionDuration: ({
    did
  }: {
    did: DID;
  }) => Promise<Uint64>;
  getSubscriptionInfo: ({
    did,
    subscriber
  }: {
    did: DID;
    subscriber: Addr;
  }) => Promise<NullableSubscriptionInfo>;
  getSubscribers: ({
    page,
    pageSize,
    wallet
  }: {
    page: Uint64;
    pageSize: Uint64;
    wallet: Addr;
  }) => Promise<GetSubscriptionListResponse>;
  getSubscriptions: ({
    page,
    pageSize,
    wallet
  }: {
    page: Uint64;
    pageSize: Uint64;
    wallet: Addr;
  }) => Promise<GetSubscriptionListResponse>;
  getSubscriberCount: ({
    wallet
  }: {
    wallet: Addr;
  }) => Promise<Uint64>;
  getSubscriptionCount: ({
    wallet
  }: {
    wallet: Addr;
  }) => Promise<Uint64>;
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
    this.getSubscribers = this.getSubscribers.bind(this);
    this.getSubscriptions = this.getSubscriptions.bind(this);
    this.getSubscriberCount = this.getSubscriberCount.bind(this);
    this.getSubscriptionCount = this.getSubscriptionCount.bind(this);
  }
  config = async (): Promise<Config> => {
    return this.client.queryContractSmart(this.contractAddress, {
      config: {}
    });
  };
  getWalletDID = async ({
    wallet
  }: {
    wallet: Addr;
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
    did: DID;
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
    did: DID;
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
    did: DID;
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
    subscriberWallet: Addr;
    targetDid: DID;
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
    did: DID;
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
    did: DID;
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
    did: DID;
    subscriber: Addr;
  }): Promise<NullableSubscriptionInfo> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_subscription_info: {
        did,
        subscriber
      }
    });
  };
  getSubscribers = async ({
    page,
    pageSize,
    wallet
  }: {
    page: Uint64;
    pageSize: Uint64;
    wallet: Addr;
  }): Promise<GetSubscriptionListResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_subscribers: {
        page,
        page_size: pageSize,
        wallet
      }
    });
  };
  getSubscriptions = async ({
    page,
    pageSize,
    wallet
  }: {
    page: Uint64;
    pageSize: Uint64;
    wallet: Addr;
  }): Promise<GetSubscriptionListResponse> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_subscriptions: {
        page,
        page_size: pageSize,
        wallet
      }
    });
  };
  getSubscriberCount = async ({
    wallet
  }: {
    wallet: Addr;
  }): Promise<Uint64> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_subscriber_count: {
        wallet
      }
    });
  };
  getSubscriptionCount = async ({
    wallet
  }: {
    wallet: Addr;
  }): Promise<Uint64> => {
    return this.client.queryContractSmart(this.contractAddress, {
      get_subscription_count: {
        wallet
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
    did: DID;
    username: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  removeDID: ({
    did,
    username
  }: {
    did: DID;
    username: string;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  updateCredentialMerkleRoot: ({
    did,
    root
  }: {
    did: DID;
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
    did: DID;
  }, fee?: number | StdFee | "auto", memo?: string, _funds?: Coin[]) => Promise<ExecuteResult>;
  tipPostAuthor: ({
    postId
  }: {
    postId: string;
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
    this.tipPostAuthor = this.tipPostAuthor.bind(this);
  }
  register = async ({
    did,
    username
  }: {
    did: DID;
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
    did: DID;
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
    did: DID;
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
    did: DID;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      subscribe: {
        did
      }
    }, fee, memo, _funds);
  };
  tipPostAuthor = async ({
    postId
  }: {
    postId: string;
  }, fee: number | StdFee | "auto" = "auto", memo?: string, _funds?: Coin[]): Promise<ExecuteResult> => {
    return await this.client.execute(this.sender, this.contractAddress, {
      tip_post_author: {
        post_id: postId
      }
    }, fee, memo, _funds);
  };
}