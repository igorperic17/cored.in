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
  isSubscriber: (
    coredinClient: CoredinClient,
    profileDid: string,
    subscriberDid: string
  ) => ({
    queryKey: [
      BaseServerStateKeys.CONTRACT_IS_SUBSCRIBED,
      profileDid,
      subscriberDid
    ],
    queryFn: () =>
      coredinClient.isSubscriber({ did: profileDid, subscriber: subscriberDid })
  })
};
