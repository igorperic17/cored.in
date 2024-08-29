/* eslint-disable @typescript-eslint/no-explicit-any */
import { CoredinQueryClient } from "@coredin/shared";

const PAGE_SIZE = 1;

export class CoredinContractService {
  constructor(private readonly coredinQueryClient: CoredinQueryClient) {}

  async getWalletInfo(wallet: string) {
    return this.coredinQueryClient.getWalletDID({ wallet });
  }

  async isWalletSubscribed(profileWallet: string, subscriberWallet: string) {
    const profileInfo = await this.getWalletInfo(profileWallet);
    // const subscriberInfo = await this.getWalletInfo(subscriberWallet);
    if (!profileInfo.did_info) {
      console.error(
        "No DID info found for profile or subscriber: ",
        profileWallet,
        profileInfo,
        subscriberWallet
      );
      return false;
    }

    const isSubscribed = await this.coredinQueryClient.isSubscriber({
      targetDid: profileInfo.did_info.did,
      subscriberWallet
    });

    return isSubscribed;
  }

  async getAllSubscriptions(profileWallet: string) {
    const allSubscriptions = [];
    let page = 0;
    let continueFetching = true;
    while (continueFetching) {
      const subscriptions = await this.getSubscriptions(profileWallet, page);
      if (
        !subscriptions.subscribers ||
        subscriptions.subscribers.length === 0
      ) {
        continueFetching = false;
        break;
      }
      allSubscriptions.push(...subscriptions.subscribers);
      continueFetching = subscriptions.subscribers.length === PAGE_SIZE;
      page++;
    }

    return allSubscriptions;
  }

  async getSubscriptions(
    requesterWallet: string,
    page: number,
    pageSize: number = PAGE_SIZE
  ) {
    try {
      const res = await this.coredinQueryClient.getSubscriptions({
        wallet: requesterWallet,
        page: page.toString(),
        pageSize: pageSize.toString()
      });
      console.log("getSubscriptionsres", res);
      return res;
    } catch (e: any) {
      console.error("Error fetching subscriptions: ", e, requesterWallet);
      return { subscribers: [] };
    }
  }

  // async isSubscribed(profileDid: string, subscriberDid: string) {
  //   return this.coredinQueryClient.isSubscriber({
  //     did: profileDid,
  //     subscriber: subscriberDid
  //   });
  // }
}
