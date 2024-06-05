import { ReactNode } from "react";
import { GasPrice } from "@cosmjs/stargate";
import { useEffect, useState } from "react";
import { useChain } from "@cosmos-kit/react";
import {
  CoredinClient,
  TESTNET_CHAIN_NAME,
  TESTNET_CHAIN_RPC_ENDPOINT,
  TESTNET_GAS_PRICE
} from "@coredin/shared";
import { CoredinClientContext } from "./CoredinClientContext";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { CONTRACT_ADDRESS } from "@coredin/shared/src/coreum/contract_address";

const CoredinClientContextProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  // const coreumRegistryTypes: ReadonlyArray<[string, GeneratedType]> = [
  //   ...defaultRegistryTypes
  // ];

  // const registry = new Registry(coreumRegistryTypes);

  const [coredinClient, setCoredinClient] = useState<CoredinClient | null>(
    null
  );
  const chainContext = useChain(TESTNET_CHAIN_NAME);

  useEffect(() => {
    const initializeClient = async () => {
      const client = await SigningCosmWasmClient.connectWithSigner(
        TESTNET_CHAIN_RPC_ENDPOINT,
        chainContext.getOfflineSigner(),
        {
          gasPrice: GasPrice.fromString(TESTNET_GAS_PRICE)
        }
      );
      setCoredinClient(
        new CoredinClient(client, chainContext.address || "", CONTRACT_ADDRESS)
      );
    };
    if (chainContext.isWalletConnected) {
      initializeClient();
    }
  }, [chainContext.isWalletConnected]);

  return (
    <CoredinClientContext.Provider value={coredinClient}>
      {children}
    </CoredinClientContext.Provider>
  );
};

export default CoredinClientContextProvider;
