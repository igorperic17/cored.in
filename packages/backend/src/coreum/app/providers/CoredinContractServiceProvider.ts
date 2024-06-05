import { CoredinContractService } from "@/coreum/services";
import {
  CONTRACT_ADDRESS,
  CoredinQueryClient,
  TESTNET_CHAIN_RPC_ENDPOINT
} from "@coredin/shared";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export const CoredinContractServiceProvider = {
  provide: CoredinContractService,
  useFactory: async () => {
    const client = await CosmWasmClient.connect(TESTNET_CHAIN_RPC_ENDPOINT);
    return new CoredinContractService(
      new CoredinQueryClient(client, CONTRACT_ADDRESS)
    );
  },
  inject: []
};
