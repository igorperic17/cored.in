/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { connectKeplr } from "@/services/keplr";
import {
  createProtobufRpcClient,
  defaultRegistryTypes,
  GasPrice,
  QueryClient
} from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { QueryClient as CoreumQueryClient } from "../coreum/query";
// import { GeneratedType, Registry } from "@cosmjs/proto-signing";
// import { coreumRegistryTypes } from "../coreum/tx";
import { persistentStorageService } from "@/dependencies";
import { ConnectedWalletKey } from "@/constants";
import {
  TESTNET_CHAIN_RPC_ENDPOINT,
  TESTNET_CHAIN_ID,
  TESTNET_GAS_PRICE
} from "@coredin/shared";
// import { MyProjectClient } from "contracts/MyProject.client";
// import { BackendService } from "services/backendService";

export interface RequestedProfile {
  walletAddress: string | null;
  setRequestedProfileWalletAddress: (walletAddress: string | null) => void;
}

export interface Authentication {
  did: string;
  token: string;
}

export interface IClientContext {
  walletAddress: string;
  auth: Authentication | null;
  signingClient: SigningCosmWasmClient | null;
  coreumQueryClient: CoreumQueryClient | null;
  //   contractClient: MyProjectClient | null;
  loading: boolean;
  error: any;
  connectWallet: any;
  disconnect: Function;
  requestedProfile: RequestedProfile;
  // TODO - handle backend
  //   backendService: BackendService;
}

const PUBLIC_RPC_ENDPOINT = TESTNET_CHAIN_RPC_ENDPOINT || "";
const PUBLIC_CHAIN_ID = TESTNET_CHAIN_ID;
const GAS_PRICE = TESTNET_GAS_PRICE || "";

export const useClientContext = (): IClientContext => {
  const [walletAddress, setWalletAddress] = useState("");
  const [signingClient, setSigningClient] =
    useState<SigningCosmWasmClient | null>(null);
  const [tmClient, setTmClient] = useState<Tendermint34Client | null>(null);
  //   const [contractClient, setContractClient] = useState<MyProjectClient | null>(
  //     null
  //   );
  const [coreumQueryClient, setCoreumQueryClient] =
    useState<CoreumQueryClient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestedProfileWalletAddress, setRequestedProfileWalletAddress] =
    useState<string | null>(null);
  //   const [backendService] = useState(new BackendService());
  const [auth, setAuth] = useState<Authentication | null>(null);

  //   useEffect(() => {
  //     if (!auth && walletAddress) {
  //       BackendService.login(walletAddress)
  //         .then((response: any) => setAuth(response))
  //         .catch((err: any) => console.error(err));
  //     }
  //   }, [auth, walletAddress]);

  // TODO - handle test and main networks
  const connectWallet = async () => {
    setLoading(true);

    try {
      await connectKeplr();

      // enable website to access keplr
      await (window as any).keplr.enable(PUBLIC_CHAIN_ID);

      // get offline signer for signing txs
      const offlineSigner = await (window as any).getOfflineSigner(
        PUBLIC_CHAIN_ID
      );

      // register default and custom messages
      //   const registryTypes: ReadonlyArray<[string, GeneratedType]> = [
      //     ...defaultRegistryTypes,
      //     ...coreumRegistryTypes
      //   ];
      //   const registry = new Registry(registryTypes);

      // signing client
      const client = await SigningCosmWasmClient.connectWithSigner(
        PUBLIC_RPC_ENDPOINT,
        offlineSigner,
        {
          gasPrice: GasPrice.fromString(GAS_PRICE)
        }
      );
      setSigningClient(client);

      // rpc client
      const tendermintClient =
        await Tendermint34Client.connect(PUBLIC_RPC_ENDPOINT);

      const queryClient = new QueryClient(tendermintClient);
      setCoreumQueryClient(
        new CoreumQueryClient(createProtobufRpcClient(queryClient))
      );

      // get user address
      const [{ address }] = await offlineSigner.getAccounts();
      //   const senderClient = await SigningCosmWasmClient.connectWithSigner(
      //     PUBLIC_RPC_ENDPOINT,
      //     offlineSigner,
      //     { gasPrice: getGasPriceWithMultiplier(feemodelQueryClient) }
      // );
      console.log(address);
      // TODO - handle contract
      //   setContractClient(
      //     new MyProjectClient(client, address, TESTNET_CONTRACT_ADDRESS)
      //   ); // TODO store address somewhere else
      setWalletAddress(address);
      persistentStorageService.save(ConnectedWalletKey, address);
      setRequestedProfileWalletAddress(address);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setError(error);
    }
  };

  const disconnect = () => {
    if (signingClient) {
      signingClient.disconnect();
    }
    if (tmClient) {
      tmClient.disconnect();
    }
    setWalletAddress("");
    persistentStorageService.remove(ConnectedWalletKey);
    setSigningClient(null);
    setLoading(false);
  };

  return {
    walletAddress,
    auth,
    signingClient,
    // contractClient,
    coreumQueryClient,
    loading,
    error,
    connectWallet,
    disconnect,
    requestedProfile: {
      walletAddress: requestedProfileWalletAddress,
      setRequestedProfileWalletAddress
    }
    // backendService
  };
};
