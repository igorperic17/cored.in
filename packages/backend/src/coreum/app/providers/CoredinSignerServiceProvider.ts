import { CoredinSignerService } from "@/coreum/services";
import { SecretsService } from "@/secrets/SecretsService";
import {
  CONTRACT_ADDRESS,
  CoredinClient,
  TESTNET_CHAIN_BECH32_PREFIX,
  TESTNET_CHAIN_RPC_ENDPOINT,
  TESTNET_GAS_PRICE
} from "@coredin/shared";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/stargate";

export const CoredinSignerServiceProvider = {
  provide: CoredinSignerService,
  useFactory: async (secretsService: SecretsService) => {
    try {
      const pKey = secretsService.get("signer_pkey");
      const signer = await DirectSecp256k1Wallet.fromKey(
        Uint8Array.from(Buffer.from(pKey, "hex")),
        TESTNET_CHAIN_BECH32_PREFIX
      );
      const client = await SigningCosmWasmClient.connectWithSigner(
        TESTNET_CHAIN_RPC_ENDPOINT,
        signer,
        {
          gasPrice: GasPrice.fromString(TESTNET_GAS_PRICE)
        }
      );
      const sender = (await signer.getAccounts())[0].address;
      console.log("Providing CoredinSignerService from sender ", sender);
      return new CoredinSignerService(
        new CoredinClient(client, sender, CONTRACT_ADDRESS)
      );
    } catch (err) {
      console.error("Exception occurred while constructing CoredinSignerServiceProvider", err);
      throw err;
    }
  },
  inject: [SecretsService]
};
