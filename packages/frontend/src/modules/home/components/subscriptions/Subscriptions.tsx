import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VisuallyHidden,
  VStack
} from "@chakra-ui/react";
import { SubscriptionListCard } from "./components";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CONTRACT_QUERIES } from "@/queries";
import { useChain } from "@cosmos-kit/react";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { CoredinClientContext } from "@/contexts/CoredinClientContext";
import { useContext, useEffect } from "react";

export const Subscriptions = () => {
  const { address } = useChain(TESTNET_CHAIN_NAME);
  const coredinClient = useContext(CoredinClientContext);
  const subscribersQuery = CONTRACT_QUERIES.getSubscribers(
    coredinClient!,
    address!
  );
  const subscriptionsQuery = CONTRACT_QUERIES.getSubscriptions(
    coredinClient!,
    address!
  );

  const {
    data: subscribers,
    fetchNextPage: fetchNextSubscribersPage,
    isFetching: isFetchingSubscribers,
    isFetchingNextPage: isFetchingNextSubscribersPage,
    hasNextPage: hasNextSubscribersPage
  } = useInfiniteQuery({
    ...subscribersQuery,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (!lastPage.subscribers || lastPage.subscribers.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    }
  });

  const {
    data: subscriptions,
    fetchNextPage: fetchNextSubscriptionsPage,
    isFetching: isFetchingSubscriptions,
    isFetchingNextPage: isFetchingNextSubscriptionsPage,
    hasNextPage: hasNextSubscriptionsPage
  } = useInfiniteQuery({
    ...subscriptionsQuery,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (!lastPage.subscribers || lastPage.subscribers.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    }
  });

  useEffect(() => {
    if (address && coredinClient) {
      console.log(
        "Fetching subscribers and subscriptions",
        address,
        coredinClient,
        subscribers,
        isFetchingSubscribers,
        subscriptions,
        isFetchingSubscriptions
      );
      if (!subscribers && !isFetchingSubscribers) fetchNextSubscribersPage();
      if (!subscriptions && !isFetchingSubscriptions)
        fetchNextSubscriptionsPage();
    }
  }, [address, coredinClient]);

  const allSubscribers = subscribers?.pages.flatMap((page) => page.subscribers);
  const allSubscriptions = subscriptions?.pages.flatMap(
    (page) => page.subscribers
  );
  // console.log("subscribers", subscribers);
  // console.log("subscriptions", subscriptions);
  // console.log("allSubscribers", allSubscribers);
  // console.log("allSubscriptions", allSubscriptions);

  return (
    <Box w="100%">
      <VisuallyHidden>
        <Heading as="h1">Subscriptions</Heading>
      </VisuallyHidden>
      <Tabs isFitted size="md" variant="unstyled">
        <TabList>
          <Tab>Subscribers</Tab>
          <Tab>Subscriptions</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {(allSubscribers || []).map((info, i) => (
              <SubscriptionListCard
                key={`subscription-${i}`}
                expirationTimestamp={info.valid_until}
                profileDid={info.subscriber}
              />
            ))}
            {(!allSubscribers || allSubscribers?.length === 0) && (
              <Box p="1em">
                <Text textStyle="sm">
                  Currently no one is subscribed to your profile.
                </Text>
              </Box>
            )}
            <Button
              onClick={() => fetchNextSubscribersPage()}
              isDisabled={
                !hasNextSubscribersPage || isFetchingNextSubscribersPage
              }
            >
              {isFetchingNextSubscribersPage
                ? "Loading more..."
                : hasNextSubscribersPage
                  ? "Load More"
                  : "Nothing more to load"}
            </Button>
          </TabPanel>
          <TabPanel>
            {(allSubscriptions || []).map((info, i) => (
              <SubscriptionListCard
                key={`subscription-${i}`}
                expirationTimestamp={info.valid_until}
                profileDid={info.subscribed_to}
              />
            ))}
            {(!allSubscriptions || allSubscriptions?.length === 0) && (
              <Box p="1em">
                <Text textStyle="sm">
                  You are not subscribed to any profile yet.{" "}
                </Text>
              </Box>
            )}
            <Button
              onClick={() => fetchNextSubscriptionsPage()}
              isDisabled={
                !hasNextSubscriptionsPage || isFetchingNextSubscriptionsPage
              }
            >
              {isFetchingNextSubscriptionsPage
                ? "Loading more..."
                : hasNextSubscriptionsPage
                  ? "Load More"
                  : "Nothing more to load"}
            </Button>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
