import { VStack } from "@chakra-ui/layout";
import { Post } from ".";
import { useAuth, useLoggedInServerState } from "@/hooks";
import { FEED_QUERIES } from "@/queries/FeedQueries";

export const Feed = () => {
  const { needsAuth } = useAuth();
  const { data: posts } = useLoggedInServerState(
    FEED_QUERIES.getFeed(needsAuth)
  );

  return (
    <VStack spacing="1.5em" w="100%" mb="4em">
      {posts?.map((post, i) => <Post key={`post-${i}`} post={post} />)}
    </VStack>
  );
};
