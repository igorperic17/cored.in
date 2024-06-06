import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { Feed, FeedProps } from "./Feed";
import { FC } from "react";
import { CredentialsContainer } from "./CredentialsContainer";

export const TabsContainer: FC<FeedProps> = ({ posts }) => {
  return (
    <Box layerStyle="cardBox" w="100%">
      <Tabs size="md" variant="unstyled">
        <TabList>
          <Tab w="50%">Posts</Tab>
          <Tab w="50%" borderBottom="none">
            Credentials
          </Tab>
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
