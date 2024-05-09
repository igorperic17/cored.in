import { Login } from "@/components";
import { VStack, Text, Heading, Link } from "@chakra-ui/react";

export const RequireWalletConnection = () => {
  return (
    <VStack
      h="82vh"
      align="center"
      justify="center"
      spacing="15vh"
      textAlign="center"
      maxW="750px"
      mx="auto"
      //   border="1px solid red"
    >
      <Heading as="h1" fontSize={{ base: "3rem", md: "4rem" }}>
        Connect your Coreum wallet to begin
      </Heading>
      <Login variant="primary" signInText="Connect wallet" />
      <Text color="text.300" fontSize={{ base: "1rem", md: "1.25rem" }}>
        Don't have a Coreum wallet yet? We support the following:
      </Text>
      <VStack
        spacing="1rem"
        fontSize={{ base: "1rem", md: "1.25rem" }}
        mt="-10vh"
      >
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
          Keplr
        </Link>
        <Link
          href="https://www.leapwallet.io/download"
          isExternal
          textDecoration="underline"
          _hover={{
            color: "brand.500"
          }}
          _focus={{
            color: "brand.500"
          }}
        >
          Leap
        </Link>
      </VStack>
    </VStack>
  );
};
