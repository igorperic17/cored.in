import {
  Avatar,
  Badge,
  Box,
  Flex,
  HStack,
  Icon,
  Link,
  Text,
  Tooltip
} from "@chakra-ui/react";
import { UserProfile } from "@coredin/shared";
import { FaPen } from "react-icons/fa6";
import { Link as ReactRouterLink } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import React from "react";

type UserHeaderProps = {
  userProfile: UserProfile;
  showEdit: boolean;
};

export const UserHeader: React.FC<UserHeaderProps> = ({
  userProfile,
  showEdit
}) => {
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
          <Text as="span" color="text.100" textStyle="md">
            {`@${userProfile.username}`}
            {/* {post.creatorWallet} */}
          </Text>
          {userProfile.issuerDid && (
            <Tooltip hasArrow label={`${userProfile.issuerDid}`} maxW="500px">
              <Badge colorScheme="brand" variant="outline">
                Issuer
              </Badge>
            </Tooltip>
          )}
        </HStack>

        <Text textStyle="sm" wordBreak="break-word">
          {userProfile.bio}
        </Text>
      </Flex>
    </Box>
  );
};
