import { VStack } from "@chakra-ui/react";
import { Feed } from "../components/Feed";
import { useChain } from "@cosmos-kit/react";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { NewPost } from "../components";

const HomePage = () => {
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const isUserConnected = chainContext.isWalletConnected;
  // chainContext.isWalletConnected; // this shows if the user is connected

  return (
    <VStack spacing="1.5em" maxW="600px" mx="auto">
      <NewPost />
      <Feed />
    </VStack>
  );
};

export default HomePage;
