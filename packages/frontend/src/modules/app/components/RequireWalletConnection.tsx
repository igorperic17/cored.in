import { Login } from "@/components";
import {
  VStack,
  Text,
  Heading,
  Link,
  Flex,
  SimpleGrid
} from "@chakra-ui/react";

export const RequireWalletConnection = () => {
  return (
    <VStack
      h="85vh"
      align="center"
      justify="center"
      spacing="15vh"
      textAlign="center"
      maxW="750px"
      mx="auto"
      //   border="1px solid red"
    >
      <Heading as="h1" fontSize={{ base: "3rem", md: "4rem" }}>
        Connect your Keplr wallet to begin
      </Heading>
      <Login variant="primary" signInText="Connect wallet" />
      <Text
        color="text.300"
        fontSize={{ base: "1rem", md: "1.25rem" }}
        mt="-10vh"
      >
        Don't have a Keplr wallet?{" "}
        <Link
          href="https://www.keplr.app/"
          isExternal
          textDecoration="underline"
          _hover={{
            color: "brand.500"
          }}
          _focus={{
            color: "brand.500"
          }}
        >
          Get one here
        </Link>
      </Text>
    </VStack>
  );
};