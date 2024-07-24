import {
  Box,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VisuallyHidden
} from "@chakra-ui/react";

const SubscriptionsPage = () => {
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
          <TabPanel></TabPanel>
          <TabPanel></TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SubscriptionsPage;
