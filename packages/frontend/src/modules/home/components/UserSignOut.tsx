import { CoredinClientContext } from "@/contexts/CoredinClientContext";
import { useAuth, useContractRead, useLoggedInServerState } from "@/hooks";
import { CONTRACT_QUERIES, USER_QUERIES } from "@/queries";
import {
  Box,
  Button,
  HStack,
  Icon,
  Link,
  Text,
  useToast,
  VStack
} from "@chakra-ui/react";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import React, { useContext } from "react";
import { FaArrowRightFromBracket, FaIdCard } from "react-icons/fa6";
import { prettifyDid } from "../helpers/prettifyDid";
import { CopyIcon } from "@chakra-ui/icons";
import { ROUTES } from "@/router/routes";
import { Link as ReactRouterLink } from "react-router-dom";

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
  const coredinClient = useContext(CoredinClientContext);
  const toast = useToast();
  const { data: walletDid } = useContractRead(
    CONTRACT_QUERIES.getWalletDid(coredinClient!, chainContext.address || ""),
    { enabled: !!coredinClient && !!chainContext.address }
  );

  const copyDid = () => {
    if (walletDid?.did_info) {
      navigator.clipboard.writeText(walletDid.did_info.did);
      toast({
        position: "top-right",
        status: "success",
        duration: 1000,
        render: () => (
          <Box
            color="text.900"
            p="1em 1.5em"
            bg="brand.300"
            borderRadius="0.5em"
          >
            DID copied to clipboard
          </Box>
        ),
        isClosable: true
      });
    }
  };

  // TODO - use a single Navigation "smart" component that handles the logic,
  // and render dummmy NavigationDesktop or NavigationMobile that receives everything as props

  return (
    <HStack spacing="1em" align="start" layerStyle="cardBox" p="2em" w="100%">
      <Icon as={FaIdCard} fontSize="1.5rem" />
      {/* <Avatar
            name="U N"
            // src="https://bit.ly/sage-adebayo"
            bg="background.600"
            color="brand.500"
          /> */}
      <VStack align="start" spacing="1.5em">
        <Link
          as={ReactRouterLink}
          to={
            userProfile?.username && chainContext.address
              ? ROUTES.USER.buildPath(chainContext.address)
              : "#"
          }
          _hover={{ textDecoration: "none" }}
        >
          <Text as="span" color="brand.900" fontSize="1rem">
            {`@${userProfile?.username || "No username"}`}
          </Text>
        </Link>
        <Button
          variant="empty"
          fontSize="0.825rem"
          mt="-1.75em"
          color="brand.900"
          rightIcon={<CopyIcon ml="0.5em" />}
          onClick={copyDid}
        >
          {walletDid?.did_info && prettifyDid(walletDid.did_info.did)}
        </Button>
        <Button
          variant="empty"
          size="xs"
          color="text.700"
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
