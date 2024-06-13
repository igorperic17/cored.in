import { VStack, useMediaQuery, useTheme } from "@chakra-ui/react";
import { SubscribeToProfile, TabsContainer, UserHeader } from "../components";
import { useParams } from "react-router-dom";
import { useLoggedInServerState } from "@/hooks";
import { FEED_QUERIES } from "@/queries/FeedQueries";
import { USER_QUERIES } from "@/queries";
import { getSections } from "../helpers/getSections";

const UserPage = () => {
  const { wallet } = useParams();
  const { data: userProfile } = useLoggedInServerState(
    USER_QUERIES.getUser(wallet || ""),
    {
      enabled: !!wallet
    }
  );
  const { data: posts } = useLoggedInServerState(
    FEED_QUERIES.getUserFeed(wallet || ""),
    { enabled: !!wallet }
  );
  // const theme = useTheme();
  // const [isLargerThanLg] = useMediaQuery(
  //   `(min-width: ${theme.breakpoints.lg})`
  // );
  if (!wallet) {
    return "This user does not exist.";
  }

  return (
    <VStack spacing={{ base: "0.5em", lg: "1.5em" }} mb="4em">
      <UserHeader />
      <TabsContainer
        posts={posts || []}
        sections={getSections(userProfile?.credentials || [])}
      />
      {/* {!isLargerThanLg && <SubscribeToProfile />} */}
      {/* <NewPost /> */}
      {/* <Feed posts={posts || []} /> */}
    </VStack>
  );
};

export default UserPage;
