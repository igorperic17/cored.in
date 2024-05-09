import { convertFromMicroDenom } from "@/utils/conversion";
import {
  TESTNET_STAKING_DENOM,
  TESTNET_GAS_PRICE,
  TESTNET_CHAIN_ID,
  TESTNET_CHAIN_NAME,
  TESTNET_CHAIN_RPC_ENDPOINT,
  TESTNET_CHAIN_REST_ENDPOINT,
  TESTNET_CHAIN_COIN_TYPE,
  TESTNET_CHAIN_BECH32_PREFIX
} from "@coredin/shared";

// extend window with CosmJS and Leap properties
interface CosmostationWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cosmostation: any;
}

declare let window: CosmostationWindow;

export const COREUM_MAINNET = {
  id: "ba442a81-f6cc-449c-9b53-657006634413",
  line: "COSMOS",
  type: "",
  chainId: "coreum-mainnet-1",
  chainName: "COREUM",
  restURL: "https://lcd-coreum.cosmostation.io",
  baseDenom: "ucore",
  displayDenom: "CORE",
  decimals: 6,
  bip44: {
    purpose: "44'",
    coinType: "990'",
    account: "0'",
    change: "0"
  },
  bech32Prefix: { address: "core" },
  coinGeckoId: "coreum",
  gasRate: {
    tiny: "0.05",
    low: "0.5",
    average: "0.5"
  },
  gas: {}
};

export const connectCosmostation = async () => {
  if (!window.cosmostation) {
    alert("Please install cosmostation extension");
  } else {
    const stakingDenom = convertFromMicroDenom(TESTNET_STAKING_DENOM || "");
    const gasPrice = Number(
      (TESTNET_GAS_PRICE || "").replace(TESTNET_STAKING_DENOM || "", "")
    );

    await window.cosmostation.cosmos.request({
      method: "cos_addChain",
      params: {
        chainId: TESTNET_CHAIN_ID,
        chainName: TESTNET_CHAIN_NAME,
        addressPrefix: TESTNET_CHAIN_BECH32_PREFIX,
        baseDenom: TESTNET_STAKING_DENOM,
        displayDenom: stakingDenom,
        restURL: TESTNET_CHAIN_REST_ENDPOINT,
        decimals: 6, // optional
        gasRate: {
          tiny: gasPrice.toString(),
          low: (gasPrice * 2).toString(),
          average: (gasPrice * 5).toString()
        }
      }
    });
  }
};
