import { VStack } from "@chakra-ui/react";
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
    <VStack spacing="1.5em">
      <NewPost />
      <Feed posts={posts || []} />
    </VStack>
  );
};

export default HomePage;
