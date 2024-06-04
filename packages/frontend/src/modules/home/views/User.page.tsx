import { Avatar, Box, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { FaPen } from "react-icons/fa6";
import { Feed, SubscribeToProfile, UserHeader } from "../components";

const UserPage = () => {
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const isUserConnected = chainContext.isWalletConnected;
  // chainContext.isWalletConnected; // this shows if the user is connected

  return (
    <VStack spacing="1.5em" maxW="600px">
      <UserHeader />
      <SubscribeToProfile />
    </VStack>
  );
};

export default UserPage;
