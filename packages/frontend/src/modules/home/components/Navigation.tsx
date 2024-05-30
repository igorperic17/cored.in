import { Logo } from "@/components/Logo";
import { ROUTES } from "@/router/routes";
import { Link as ReactRouterLink } from "react-router-dom";
import { navigationData } from "../constants/navigationData";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Link,
  Text,
  VStack
} from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { FaIdCard, FaArrowRightFromBracket } from "react-icons/fa6";
import React from "react";
import { useAuth, useLoggedInServerState } from "@/hooks";
import { USER_QUERIES } from "@/queries";

export const Navigation = () => {
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
    <VStack
      w="25%"
      h="max-content"
      bg="background.700"
      borderRadius="0.5em"
      p="2em"
      align="start"
      spacing="6em"
      position="sticky"
      top="1em"
      flex="1"
      // outline="1px solid red"
    >
      <VStack align="start" spacing="2em">
        <Link
          as={ReactRouterLink}
          to={ROUTES.ROOT.path}
          _hover={{ textDecoration: "none" }}
          aria-label="Main page."
        >
          <Logo fontSize={{ base: "1.5rem", md: "2rem" }} />
        </Link>
      </VStack>
      <Box as="nav" w="100%">
        <Flex as="ul" direction="column" listStyleType="none" gap="1em">
          {navigationData.map((item, index) => (
            <Box as="li" key={`home-navigation-${index}`} color="text.100">
              <Link
                as={ReactRouterLink}
                to={item.link}
                fontSize="1.375rem"
                color="inherit"
                _hover={{
                  div: {
                    background: "background.600"
                  }
                  // textDecoration: "none"
                }}
                _focus={{
                  div: {
                    background: "background.600"
                  }
                  // outline: "none",
                  // textDecoration: "none"
                }}
              >
                <HStack spacing="0.75em" p="0.5em 1.75em" borderRadius="0.5em">
                  <Icon as={item.icon} />
                  <Text as="span">{`${item.title[0].toUpperCase()}${item.title.slice(1)}`}</Text>
                </HStack>
              </Link>
            </Box>
          ))}
        </Flex>
      </Box>
      <HStack spacing="1em" align="start">
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
    </VStack>
  );
};
