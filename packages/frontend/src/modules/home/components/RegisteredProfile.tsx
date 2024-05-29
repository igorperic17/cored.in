import { Heading, Text, VStack } from "@chakra-ui/react";
import { DidInfo } from "@coredin/shared";
import { FC } from "react";

export const RegisteredProfile: FC<Partial<DidInfo>> = ({ did, username }) => {
  return (
    <VStack
      spacing="2em"
      justify="center"
      w="100%"
      maxW="1200px"
      minH="50vh"
      background="background.800"
      mx="auto"
      mt="52px"
      px="2em"
      py="2em"
      borderRadius="16px"
      textAlign="center"
    >
      <Heading
        as="h2"
        color="text.700"
        fontSize={{ base: "1rem", md: "1.75rem" }}
        // textOverflow="ellipsis"
        // whiteSpace="nowrap"
        // overflow="hidden"
        maxW="700px"
        textTransform="uppercase"
        noOfLines={[2, 1]}
      >
        Welcome back,{" "}
        <Text as="span" color="brand.500" textTransform="none">
          {username}
        </Text>
      </Heading>
      <Heading
        as="h2"
        fontSize={{ base: "1rem", md: "1.25rem" }}
        color="text.700"
      >
        Your DID registered onchain is:
        <Text
          as="span"
          display="block"
          color="text.300"
          maxW="700px"
          mt="0.5em"
          wordBreak="break-all"
        >
          {did}
        </Text>
      </Heading>
    </VStack>
  );
};
