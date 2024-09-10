import { Box, Heading, VStack, VisuallyHidden } from "@chakra-ui/react";
import { Feed } from "../components/Feed";
import { NewMessage } from "../components";
import { useLoggedInServerState } from "@/hooks";
import { FEED_QUERIES } from "@/queries/FeedQueries";

const MessagesPage = () => {
  const { data: messages } = useLoggedInServerState(FEED_QUERIES.getMessages());

  return (
    <VStack spacing={{ base: "0.5em", lg: "1.5em" }}>
      <VisuallyHidden>
        <Heading as="h1">Home page, message feed</Heading>
      </VisuallyHidden>
      {/* <NewMessage /> */}
      <Box layerStyle="cardBox" py="1em" w="100%">
        <Feed posts={messages || []} />
      </Box>
    </VStack>
  );
};

export default MessagesPage;
