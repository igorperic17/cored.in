import { VStack } from "@chakra-ui/react";
import { Feed, NewPost, SubscribeToProfile, UserHeader } from "../components";
import { useParams } from "react-router-dom";
import { useLoggedInServerState } from "@/hooks";
import { FEED_QUERIES } from "@/queries/FeedQueries";

const UserPage = () => {
  const { wallet } = useParams();
  const { data: posts } = useLoggedInServerState(
    FEED_QUERIES.getUserFeed(wallet || ""),
    { enabled: !!wallet }
  );
  if (!wallet) {
    return "This user does not exist.";
  }

  return (
    <VStack spacing={{ base: "0.5em", lg: "1.5em" }}>
      <UserHeader />
      <SubscribeToProfile />
      <NewPost />
      <Feed posts={posts || []} />
    </VStack>
  );
};

export default UserPage;
