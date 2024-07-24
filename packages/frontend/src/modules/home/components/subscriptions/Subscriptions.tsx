import {
  Avatar,
  Box,
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

export const Subscriptions = () => {
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
            {/* <VStack
              as="ul"
              listStyleType="none"
              align="start"
              //   borderRadius="1em"
            >
            </VStack> */}
            <Box p="1em">
              <Text textStyle="sm">
                Currently no one is subscribed to your profile.
              </Text>
            </Box>
          </TabPanel>
          <TabPanel>
            <SubscriptionListCard />
            <SubscriptionListCard />
            <SubscriptionListCard />
            <SubscriptionListCard />
            {/* <Box p="1em">
              <Text textStyle="sm">
                You are not subscribed to any profile yet.
              </Text> */}
            {/* </Box> */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
