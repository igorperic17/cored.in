import { Box, Heading, VStack, VisuallyHidden } from "@chakra-ui/react";
import { Feed } from "../components/Feed";
import { NewPost } from "../components";
import { useAuth, useLoggedInServerState } from "@/hooks";
import { FEED_QUERIES } from "@/queries/FeedQueries";

const HomePage = () => {
  const { needsAuth } = useAuth();
  const { data: posts } = useLoggedInServerState(
    FEED_QUERIES.getFeed(needsAuth)
  );

  return (
    <VStack spacing={{ base: "0.5em", lg: "1.5em" }}>
      <VisuallyHidden>
        <Heading as="h1">Home page, user feed</Heading>
      </VisuallyHidden>
      <NewPost />
      <Box layerStyle="cardBox" py="1em" w="100%">
        <Feed posts={posts || []} />
      </Box>
    </VStack>
  );
};

export default HomePage;
