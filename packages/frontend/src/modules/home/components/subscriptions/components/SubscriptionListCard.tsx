import {
  Avatar,
  Button,
  ButtonGroup,
  Flex,
  Link,
  Text,
  VStack
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { useContractRead } from "@/hooks";
import { CONTRACT_QUERIES } from "@/queries";
import { CoredinClientContext } from "@/contexts/CoredinClientContext";
import { ROUTES } from "@/router/routes";
import { Link as ReactRouterLink } from "react-router-dom";

type SubscriptionListCardProps = {
  profileDid: string;
  expirationTimestamp: string;
};

export const SubscriptionListCard: React.FC<SubscriptionListCardProps> = ({
  profileDid,
  expirationTimestamp
}) => {
  const coredinClient = useContext(CoredinClientContext);
  const profileInfo = useContractRead(
    CONTRACT_QUERIES.getInfoFromDid(coredinClient!, profileDid),
    { enabled: !!coredinClient && !!profileDid }
  );

  const username = profileInfo.data?.did_info?.username;
  const wallet = profileInfo?.data?.did_info?.wallet;

  return (
    <Flex
      as="li"
      direction="row"
      gap="0.5em"
      align="center"
      // justify="start"
      w="100%"
      py="1em"
      px="1em"
      borderLeft="1px solid"
      borderLeftColor="transparent"
      borderBottom="1px solid"
      borderBottomColor="brand.100"
      _last={{ borderBottom: "none", pb: "0" }}
      _hover={{
        color: "brand.500",

        borderLeftColor: "brand.500"
      }}
    >
      <Avatar
        name={profileInfo.data?.did_info?.username}
        bg="brand.100"
        color="brand.500"
        border="1px solid #b0b0b0"
        size="md"
      />
      {/* Copied from Post Content */}
      {/* <Avatar
            name={post.creatorUsername}
            src={post.creatorAvatar}
            bg="brand.100"
            color={post.creatorAvatarFallbackColor || "brand.500"}
            border={post.creatorAvatar || "1px solid #b0b0b0"}
            size="md"
          /> */}
      <VStack
        align="start"
        spacing="0em"
        textOverflow="ellipsis"
        display="inline"
        whiteSpace="nowrap"
        overflow="hidden"
        maxW={{ base: "170px", sm: "300px" }}
      >
        {wallet && (
          <Link as={ReactRouterLink} to={ROUTES.USER.buildPath(wallet)}>
            <Text
              as="span"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
            >
              @{username}
            </Text>
          </Link>
        )}
        {/* <Text
          as="span"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
        >
          Subscribed to:
          {info.subscribed_to}
        </Text> */}
        <Text
          color="text.700"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
          textStyle="sm"
        >
          Expires:
          <Text as="span">
            {new Date(parseInt(expirationTimestamp) / 1000000).toLocaleString()}
          </Text>
        </Text>
      </VStack>

      {/* <ButtonGroup
        display="flex"
        flexDir="column"
        ml="auto"
        variant="empty"
        size="xs"
      >
        <Button color="text.700" _hover={{ color: "brand.400" }}>
          Remove
        </Button>
        <Button>Renew</Button>
      </ButtonGroup> */}
    </Flex>
  );
};
