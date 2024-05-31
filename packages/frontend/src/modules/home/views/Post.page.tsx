import { Box, VStack } from "@chakra-ui/react";
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

  return (
    <Box mx="auto" maxW="1200px" pt="1.5em" mb="32">
      <VStack px="2em">{postDetail && <Post post={postDetail} />}</VStack>
    </Box>
  );
};
