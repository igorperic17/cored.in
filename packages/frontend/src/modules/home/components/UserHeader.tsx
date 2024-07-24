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
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { TESTNET_STAKING_DENOM, UserProfile } from "@coredin/shared";
import { FaCheckDouble, FaPen } from "react-icons/fa6";
import { Link as ReactRouterLink } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import React, { useContext } from "react";
import { CoredinClientContext } from "@/contexts/CoredinClientContext";
import { prettifyDid } from "../helpers/prettifyDid";
import { CopyIcon } from "@chakra-ui/icons";
import { SubscriptionModal } from ".";
import { useContractRead } from "@/hooks";
import { CONTRACT_QUERIES } from "@/queries";

type UserHeaderProps = {
  userProfile: UserProfile;
  isOwnProfile: boolean;
  profileWallet: string;
  userWallet: string;
};

export const UserHeader: React.FC<UserHeaderProps> = ({
  userProfile,
  isOwnProfile,
  profileWallet,
  userWallet
}) => {
  const coredinClient = useContext(CoredinClientContext);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: profileDid } = useContractRead(
    CONTRACT_QUERIES.getWalletDid(coredinClient!, profileWallet),
    { enabled: !!coredinClient }
  );
  const { data: userDid } = useContractRead(
    CONTRACT_QUERIES.getWalletDid(coredinClient!, userWallet),
    { enabled: !!coredinClient }
  );
  const { data: isSubscribed } = useContractRead(
    CONTRACT_QUERIES.isSubscriber(
      coredinClient!,
      profileDid?.did_info?.did || "",
      userDid?.did_info?.did || ""
    ),
    {
      enabled:
        !!coredinClient &&
        !!profileDid?.did_info?.did &&
        !!userDid?.did_info?.did
    }
  );
  const { data: subscriptionPrice } = useContractRead(
    CONTRACT_QUERIES.getSubscriptionPrice(
      coredinClient!,
      profileDid?.did_info?.did || ""
    ),
    { enabled: !!coredinClient && !!profileDid?.did_info?.did }
  );

  // TODO - get actual values from contract!
  // const subscriptionPrice = 4.45;
  const subscriptionDurationDays = 7;

  const handleSubscribe = () => {
    console.log("Subscribing to", profileDid?.did_info?.did);
    if (coredinClient && profileDid?.did_info) {
      coredinClient
        .subscribe(
          {
            did: profileDid?.did_info?.did || ""
          },
          "auto",
          undefined,
          [
            {
              amount: "10",
              denom: TESTNET_STAKING_DENOM
            }
          ]
        )
        .then(() => {
          toast({
            position: "top-right",
            status: "success",
            duration: 3000,
            render: () => (
              <Box
                color="text.900"
                p="1em 1.5em"
                bg="brand.500"
                borderRadius="0.5em"
              >
                Subscribed to {userProfile.username}
              </Box>
            ),
            isClosable: true
          });
        })
        .catch((error) => {
          console.error(
            "Error subscribing to",
            profileDid?.did_info?.did,
            error
          );
          toast({
            position: "top-right",
            status: "error",
            duration: 3000,
            render: () => (
              <Box
                color="text.900"
                p="1em 1.5em"
                bg="red.500"
                borderRadius="0.5em"
              >
                Error subscribing to {userProfile.username}
              </Box>
            ),
            isClosable: true
          });
        });
    }
    onClose();
  };

  const copyDid = () => {
    if (profileDid?.did_info) {
      navigator.clipboard.writeText(profileDid.did_info.did);
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
        {isOwnProfile && (
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

        {profileDid?.did_info?.did && (
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
            {prettifyDid(profileDid.did_info.did)}
          </Button>
        )}

        <Text textStyle="sm" wordBreak="break-word">
          {userProfile.bio}
        </Text>

        {!isOwnProfile && !isSubscribed && subscriptionPrice && (
          <>
            <Button variant="primary" size="sm" onClick={onOpen}>
              Subscribe for {subscriptionPrice.amount}{" "}
              {subscriptionPrice?.denom}
            </Button>
            <SubscriptionModal
              isOpen={isOpen}
              onClose={onClose}
              username={userProfile.username}
              subscriptionPrice={subscriptionPrice.amount}
              subscriptionDurationDays={subscriptionDurationDays}
              handleSubscribe={handleSubscribe}
            />
          </>
        )}

        {isSubscribed && (
          <HStack>
            <Icon as={FaCheckDouble} color="brand.500" />
            <Text as="span" textStyle="sm" color="brand.500">
              Subscribed
            </Text>
          </HStack>
        )}
      </Flex>
    </Box>
  );
};
