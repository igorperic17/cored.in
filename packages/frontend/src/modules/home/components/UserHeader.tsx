import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  Link,
  Text,
  Tooltip,
  VisuallyHidden,
  useToast
} from "@chakra-ui/react";
import {
  DidInfo,
  GetDIDResponse,
  TESTNET_CHAIN_NAME,
  UserProfile
} from "@coredin/shared";
import { FaPen } from "react-icons/fa6";
import { Link as ReactRouterLink } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import React, { useContext, useEffect, useState } from "react";
import { useChain } from "@cosmos-kit/react";
import { CoredinClientContext } from "@/contexts/CoredinClientContext";
import { prettifyDid } from "../helpers/prettifyDid";
import { CopyIcon } from "@chakra-ui/icons";

type UserHeaderProps = {
  userProfile: UserProfile;
  showEdit: boolean;
};

export const UserHeader: React.FC<UserHeaderProps> = ({
  userProfile,
  showEdit
}) => {
  const chainContext = useChain(TESTNET_CHAIN_NAME);
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
            User DID copied to clipboard
          </Box>
        ),
        isClosable: true
      });
    }
  };

  return (
    <Box layerStyle="cardBox" w="100%">
      <Box
        h={{ base: "75px", sm: "90px", lg: "125px" }}
        w="100%"
        bg={userProfile.backgroundColor || "brand.500"}
        borderTopRadius="inherit"
      ></Box>
      <Flex
        justify="space-between"
        mx="1em"
        // border="1px solid red"
        align="center"
        mt={{ base: "-2.5em", sm: "-3em", lg: "-4em" }}
      >
        <Avatar
          name={userProfile.username}
          src={userProfile.avatarUrl}
          bg="background.600"
          color={userProfile.avatarFallbackColor || "brand.500"}
          size={{ base: "lg", sm: "xl", lg: "2xl" }}
          // ml="0.5em"
          border="4px solid #1C1C1A"
        />
        {showEdit && (
          <Link
            as={ReactRouterLink}
            to={ROUTES.SETTINGS.path}
            aria-label="Edit profile."
            variant="empty"
            size="sm"
            color="text.400"
            mt="3.5em"
            // mt={{ base: "-3rem", md: "-4.5rem" }}
            _hover={{
              textDecoration: "none",
              color: "text.100"
            }}
          >
            <Icon as={FaPen} size="0.875rem" />
            <Text as="span" ml="0.375em">
              Edit
            </Text>
          </Link>
        )}
      </Flex>
      <Flex direction="column" gap="1.5em" px="1.125em" pt="1.75em" pb="2.5em">
        <HStack justify="space-between">
          <VisuallyHidden>
            <Heading as="h1">{userProfile.username}'s profile page</Heading>
          </VisuallyHidden>
          <Text as="span" color="text.100" textStyle="md">
            {`@${userProfile.username}`}
          </Text>
          {userProfile.issuerDid && (
            <Tooltip hasArrow label={`${userProfile.issuerDid}`} maxW="500px">
              <Badge colorScheme="brand" variant="outline">
                Issuer
              </Badge>
            </Tooltip>
          )}
        </HStack>

        {onchainProfile && (
          <Button
            variant="empty"
            size="sm"
            color="text.400"
            alignSelf="start"
            rightIcon={<CopyIcon ml="0.5em" />}
            aria-label="Copy user DID."
            mt="-1em"
            onClick={copyDid}
          >
            {prettifyDid(onchainProfile.did)}
          </Button>
        )}

        <Text textStyle="sm" wordBreak="break-word">
          {userProfile.bio}
        </Text>
      </Flex>
    </Box>
  );
};
