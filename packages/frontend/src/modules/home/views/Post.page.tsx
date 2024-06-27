import { Box, Text, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Post } from "../components";
import { useLoggedInServerState } from "@/hooks";
import { FEED_QUERIES } from "@/queries/FeedQueries";

export const PostPage = () => {
  const { wallet, id } = useParams();
  const { data: postDetail, isLoading: isDetailLoading } =
    useLoggedInServerState(FEED_QUERIES.get(parseInt(id || "0")));
  if (!id || !wallet) {
    return "This post does not exist.";
  }
  console.log(postDetail);

  return (
    <Box layerStyle="cardBox">
      {postDetail && <Post post={postDetail} />}
      {!postDetail && <Text>Post not found...</Text>}
    </Box>
  );
};
