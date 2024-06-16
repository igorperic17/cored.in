import { ReactNode } from "react";
import { GasPrice } from "@cosmjs/stargate";
import { useEffect, useState } from "react";
import { useChain } from "@cosmos-kit/react";
import {
  CoredinClient,
  CONTRACT_ADDRESS,
  TESTNET_CHAIN_NAME,
  TESTNET_CHAIN_RPC_ENDPOINT,
  TESTNET_GAS_PRICE
} from "@coredin/shared";
import { CoredinClientContext } from "./CoredinClientContext";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

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
      const newClient = new CoredinClient(
        client,
        chainContext.address || "",
        CONTRACT_ADDRESS
      );
      setCoredinClient(newClient);
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
