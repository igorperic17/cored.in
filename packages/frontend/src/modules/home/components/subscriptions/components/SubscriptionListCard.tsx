import { Avatar, Box, Button, Flex, Text, VStack } from "@chakra-ui/react";

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
      borderBottom="2px solid #3E3D3A"
      _last={{ borderBottom: "none" }}
      _hover={{
        color: "brand.500",

        borderLeftColor: "brand.500"
      }}
    >
      <Avatar
        // name={issuer.username}
        name="N"
        // src={issuer.avatarUrl}
        bg="background.600"
        // color={issuer.avatarFallbackColor || "brand.500"}
        size={{ base: "sm", sm: "md", lg: "md" }}
      />
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
          @natalialeap1fghfghfjgfjgfjghjdtrjhg
        </Text>
        <Text
          color="text.400"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
          textStyle="sm"
        >
          Expires:
          <Text as="span">{` 30.12.2024`}</Text>
        </Text>
      </VStack>

      <VStack ml="auto" spacing="0" align="end">
        <Button variant="empty" size="xs" color="text.400">
          Remove
        </Button>
        <Button variant="empty" size="xs">
          Renew
        </Button>
      </VStack>
    </Flex>
  );
};
