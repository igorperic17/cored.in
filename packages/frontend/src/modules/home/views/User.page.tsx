import { Box, VStack } from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";

const UserPage = () => {
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const isUserConnected = chainContext.isWalletConnected;
  // chainContext.isWalletConnected; // this shows if the user is connected

  return (
    <VStack spacing="1.5em" maxW="600px" mx="auto">
      <Box>User profile here</Box>
    </VStack>
  );
};

export default UserPage;
