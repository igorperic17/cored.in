import {
  Avatar,
  Button,
  ButtonGroup,
  Flex,
  Text,
  VStack
} from "@chakra-ui/react";

// type SubscriptionListCardProps = {
//   username: string,
//   expiratinDate:
// }

export const SubscriptionListCard = () => {
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
        // name={issuer.username}
        name="N"
        // src={issuer.avatarUrl}
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
        <Text
          as="span"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
        >
          natalialeap1fghfghfjgfjgfjghjdtrjhg
        </Text>
        <Text
          color="text.700"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
          textStyle="sm"
        >
          Expires:
          <Text as="span">{` 30.12.2024`}</Text>
        </Text>
      </VStack>

      <ButtonGroup
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
      </ButtonGroup>
    </Flex>
  );
};
