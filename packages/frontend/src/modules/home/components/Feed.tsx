import { VStack } from "@chakra-ui/layout";
import { NewPost, Post } from ".";
import { useAuth, useLoggedInServerState } from "@/hooks";
import { FEED_QUERIES } from "@/queries/FeedQueries";

export const Feed = () => {
  const { needsAuth } = useAuth();
  const { data: posts } = useLoggedInServerState(
    FEED_QUERIES.getFeed(needsAuth)
  );

  console.log(posts);

  return (
    <VStack spacing="1em">
      <NewPost />
      {posts?.map((post, i) => <Post key={`post-${i}`} post={post} />)}
    </VStack>
  );
};
