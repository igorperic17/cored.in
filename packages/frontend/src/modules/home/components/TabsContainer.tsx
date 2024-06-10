import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Feed, FeedProps } from "./Feed";
import { FC } from "react";
import { CredentialsContainer } from "./CredentialsContainer";

export const TabsContainer: FC<FeedProps> = ({ posts }) => {
  return (
    <Box w="100%">
      <Tabs isFitted size="md" variant="unstyled">
        <TabList>
          <Tab>Posts</Tab>
          <Tab>Credentials</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Feed posts={posts} />
          </TabPanel>
          <TabPanel>
            <CredentialsContainer />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};