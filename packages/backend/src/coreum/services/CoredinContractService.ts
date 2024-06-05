import { CoredinQueryClient } from "@coredin/shared";

export class CoredinContractService {
  constructor(private readonly coredinQueryClient: CoredinQueryClient) {}

  async getWalletInfo(wallet: string) {
    return this.coredinQueryClient.getWalletDID({ wallet });
  }
}
