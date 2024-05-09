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
interface LeapWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  leap: any;
}

declare let window: LeapWindow;

export const connectLeap = async () => {
  if (!window.leap) {
    alert("Please install leap extension");
  } else {
    if (window.leap.experimentalSuggestChain) {
      const stakingDenom = convertFromMicroDenom(TESTNET_STAKING_DENOM || "");
      const gasPrice = Number(
        (TESTNET_GAS_PRICE || "").replace(TESTNET_STAKING_DENOM || "", "")
      );

      try {
        await window.leap.experimentalSuggestChain({
          // Chain-id of the Cosmos SDK chain.
          chainId: TESTNET_CHAIN_ID,
          // The name of the chain to be displayed to the user.
          chainName: TESTNET_CHAIN_NAME,
          // RPC endpoint of the chain.
          rpc: TESTNET_CHAIN_RPC_ENDPOINT,
          // REST endpoint of the chain.
          rest: TESTNET_CHAIN_REST_ENDPOINT,
          // Staking coin information
          stakeCurrency: {
            // Coin denomination to be displayed to the user.
            coinDenom: stakingDenom,
            // Actual denom (i.e. uatom, uscrt) used by the blockchain.
            coinMinimalDenom: TESTNET_STAKING_DENOM,
            // # of decimal points to convert minimal denomination to user-facing denomination.
            coinDecimals: 6
            // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
            // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
            // coinGeckoId: ""
          },
          // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
          // The 'stake' button in Keplr extension will link to the webpage.
          // walletUrlForStaking: "",
          // The BIP44 path.
          bip44: {
            // You can only set the coin type of BIP44.
            // 'Purpose' is fixed to 44.
            coinType: Number(TESTNET_CHAIN_COIN_TYPE)
          },
          // Bech32 configuration to show the address to user.
          bech32Config: {
            bech32PrefixAccAddr: TESTNET_CHAIN_BECH32_PREFIX,
            bech32PrefixAccPub: `${TESTNET_CHAIN_BECH32_PREFIX}pub`,
            bech32PrefixValAddr: `${TESTNET_CHAIN_BECH32_PREFIX}valoper`,
            bech32PrefixValPub: `${TESTNET_CHAIN_BECH32_PREFIX}valoperpub`,
            bech32PrefixConsAddr: `${TESTNET_CHAIN_BECH32_PREFIX}valcons`,
            bech32PrefixConsPub: `${TESTNET_CHAIN_BECH32_PREFIX}valconspub`
          },
          // List of all coin/tokens used in this chain.
          currencies: [
            {
              // Coin denomination to be displayed to the user.
              coinDenom: stakingDenom,
              // Actual denom (i.e. uatom, uscrt) used by the blockchain.
              coinMinimalDenom: TESTNET_STAKING_DENOM,
              // # of decimal points to convert minimal denomination to user-facing denomination.
              coinDecimals: 6
              // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
              // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
              // coinGeckoId: ""
            }
          ],
          // List of coin/tokens used as a fee token in this chain.
          feeCurrencies: [
            {
              // Coin denomination to be displayed to the user.
              coinDenom: stakingDenom,
              // Actual denom (i.e. uatom, uscrt) used by the blockchain.
              coinMinimalDenom: TESTNET_STAKING_DENOM,
              // # of decimal points to convert minimal denomination to user-facing denomination.
              coinDecimals: 6
              // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
              // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
              // coinGeckoId: ""
            }
          ],
          // (Optional) The number of the coin type.
          // This field is only used to fetch the address from ENS.
          // Ideally, it is recommended to be the same with BIP44 path's coin type.
          // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
          // So, this is separated to support such chains.
          coinType: Number(TESTNET_CHAIN_COIN_TYPE),
          // (Optional) This is used to set the fee of the transaction.
          // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
          // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
          // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
          gasPriceStep: {
            low: gasPrice,
            average: gasPrice,
            high: gasPrice
          }
        });
      } catch {
        alert("Failed to suggest the chain");
      }
    } else {
      alert("Please use the recent version of keplr extension");
    }
  }
};
