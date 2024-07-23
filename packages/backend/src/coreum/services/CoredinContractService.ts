import { CoredinQueryClient } from "@coredin/shared";

export class CoredinContractService {
  constructor(private readonly coredinQueryClient: CoredinQueryClient) {}

  async getWalletInfo(wallet: string) {
    return this.coredinQueryClient.getWalletDID({ wallet });
  }

  async isWalletSubscribed(profileWallet: string, subscriberWallet: string) {
    const profileInfo = await this.getWalletInfo(profileWallet);
    const subscriberInfo = await this.getWalletInfo(subscriberWallet);
    if (!profileInfo.did_info || !subscriberInfo.did_info) {
      console.error(
        "No DID info found for profile or subscriber: ",
        profileWallet,
        profileInfo,
        subscriberWallet,
        subscriberInfo
      );
      return false;
    }
    return this.coredinQueryClient.isSubscriber({
      did: profileInfo.did_info.did,
      subscriber: subscriberInfo.did_info.did
    });
  }

  async isSubscribed(profileDid: string, subscriberDid: string) {
    return this.coredinQueryClient.isSubscriber({
      did: profileDid,
      subscriber: subscriberDid
    });
  }
}
