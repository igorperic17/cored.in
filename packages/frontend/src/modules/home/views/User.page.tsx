import { Avatar, Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { FaPen } from "react-icons/fa6";
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
    <VStack spacing="1.5em" maxW="600px">
      <UserHeader />
      <SubscribeToProfile />
      <Feed posts={posts || []} />
      <NewPost />
    </VStack>
  );
};

export default UserPage;
