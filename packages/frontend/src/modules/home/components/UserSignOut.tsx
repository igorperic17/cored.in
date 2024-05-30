import { useAuth, useLoggedInServerState } from "@/hooks";
import { USER_QUERIES } from "@/queries";
import { Button, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import React from "react";
import { FaArrowRightFromBracket, FaIdCard } from "react-icons/fa6";

export const UserSignOut = () => {
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const { needsAuth } = useAuth();
  const { data: userProfile, isLoading } = useLoggedInServerState(
    USER_QUERIES.getUser(chainContext.address || "", needsAuth),
    {
      enabled: !!chainContext.address
    }
  );
  const handleDisconnectWallet = React.useCallback(() => {
    if (chainContext.isWalletConnected) {
      chainContext.disconnect();
    }
  }, [chainContext]);
  const shortWalletAddress =
    chainContext.address?.slice(0, 8) + "..." + chainContext.address?.slice(-8);

  // TODO - use a single Navigation "smart" component that handles the logic,
  // and render dummmy NavigationDesktop or NavigationMobile that receive everything as props

  return (
    <HStack
      spacing="1em"
      align="start"
      bg="background.700"
      borderRadius="0.5em"
      p="2em"
      w="100%"
    >
      <Icon as={FaIdCard} fontSize="1.5rem" />
      {/* <Avatar
            name="U N"
            // src="https://bit.ly/sage-adebayo"
            bg="background.600"
            color="brand.500"
          /> */}
      <VStack align="start" spacing="1.25em">
        <Text as="span" color="text.100" fontSize="1rem">
          {`@${userProfile?.username || "No username"}`}
        </Text>
        <Text
          as="span"
          color="text.400"
          textTransform="uppercase"
          mt="-1em"
          fontSize="0.825rem"
        >
          {shortWalletAddress}
        </Text>
        <Button
          variant="empty"
          size="xs"
          color="text.400"
          onClick={handleDisconnectWallet}
          rightIcon={<FaArrowRightFromBracket />}
        >
          <Text as="span" mt="3px" mr="0.5em">
            Sign out
          </Text>
        </Button>
      </VStack>
    </HStack>
  );
};
