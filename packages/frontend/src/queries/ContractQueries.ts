import { BaseServerStateKeys } from "@/constants";
import { CoredinClient } from "@coredin/shared";

export const CONTRACT_QUERIES = {
  getWalletDid: (coredinClient: CoredinClient, wallet: string) => ({
    queryKey: [BaseServerStateKeys.CONTRACT_GET_WALLET_DID, wallet],
    queryFn: () => coredinClient.getWalletDID({ wallet })
  }),
  getSubscriptionPrice: (coredinClient: CoredinClient, did: string) => ({
    queryKey: [BaseServerStateKeys.CONTRACT_GET_SUBSCRIPTION_PRICE, did],
    queryFn: () => coredinClient.getSubscriptionPrice({ did })
  }),
  getSubscriptionDuration: (coredinClient: CoredinClient, did: string) => ({
    queryKey: [BaseServerStateKeys.CONTRACT_GET_SUBSCRIPTION_DURATION, did],
    queryFn: () => coredinClient.getSubscriptionDuration({ did })
  }),
  isSubscriber: (
    coredinClient: CoredinClient,
    profileDid: string,
    subscriberWallet: string
  ) => ({
    queryKey: [
      BaseServerStateKeys.CONTRACT_IS_SUBSCRIBED,
      profileDid,
      subscriberWallet
    ],
    queryFn: () =>
      coredinClient.isSubscriber({ targetDid: profileDid, subscriberWallet })
  }),
  getSubscriptionInfo: (
    coredinClient: CoredinClient,
    profileDid: string,
    subscriberDid: string
  ) => ({
    queryKey: [
      BaseServerStateKeys.CONTRACT_SUBSCRIPTION_INFO,
      profileDid,
      subscriberDid
    ],
    queryFn: () =>
      coredinClient.getSubscriptionInfo({
        did: profileDid,
        subscriber: subscriberDid
      })
  })
};
