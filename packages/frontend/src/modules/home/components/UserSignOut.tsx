import { CoredinClientContext } from "@/contexts/CoredinClientContext";
import { useAuth, useLoggedInServerState } from "@/hooks";
import { USER_QUERIES } from "@/queries";
import {
  Box,
  Button,
  HStack,
  Icon,
  Text,
  useToast,
  VStack
} from "@chakra-ui/react";
import { DidInfo, GetDIDResponse, TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import React, { useContext, useEffect, useState } from "react";
import { FaArrowRightFromBracket, FaIdCard } from "react-icons/fa6";
import { prettifyDid } from "../helpers/prettifyDid";
import { CopyIcon } from "@chakra-ui/icons";

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
  const [onchainProfile, setOnchainProfile] = useState<DidInfo | null>(null);
  const toast = useToast();

  const updateOnchainProfile = () => {
    if (chainContext.address) {
      console.log("getting onchain profile");
      coredinClient
        ?.getWalletDID({ wallet: chainContext.address })
        .then((registered_did: GetDIDResponse) => {
          console.log(registered_did);
          if (registered_did.did_info) {
            setOnchainProfile(registered_did.did_info);
          }
          // setIsLoadingContract(false);
        })
        .catch((error) => {
          console.error(error);
          // setIsLoadingContract(false);
        });
    } else {
      setOnchainProfile(null);
    }
  };

  useEffect(updateOnchainProfile, [
    chainContext.address,
    chainContext.isWalletConnected,
    coredinClient
  ]);

  const copyDid = () => {
    if (onchainProfile?.did) {
      navigator.clipboard.writeText(onchainProfile?.did);
      toast({
        position: "top-right",
        status: "success",
        duration: 1000,
        render: () => (
          <Box
            color="text.900"
            p="1em 1.5em"
            bg="brand.500"
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
      <VStack align="start" spacing="1.25em">
        <Text as="span" color="text.100" fontSize="1rem">
          {`@${userProfile?.username || "No username"}`}
        </Text>
        <Button
          variant="empty"
          fontSize="0.825rem"
          mt="-1em"
          color="text.400"
          rightIcon={<CopyIcon ml="0.5em" />}
          onClick={copyDid}
        >
          {onchainProfile?.did && prettifyDid(onchainProfile.did)}
        </Button>
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
