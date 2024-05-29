import { Login } from "@/components";
import { VStack, Text, Heading, Link, Stack } from "@chakra-ui/react";

export const RequireWalletConnection = () => {
  return (
    <VStack
      h="82vh"
      align="center"
      justify="center"
      spacing="15vh"
      textAlign="center"
      maxW="600px"
      mx="auto"
      //   border="1px solid red"
    >
      <Heading as="h1" fontSize={{ base: "3rem", md: "4rem" }}>
        Connect your wallet to begin
      </Heading>
      <VStack
        spacing="1rem"
        fontSize={{ base: "1rem", md: "1.25rem" }}
        mt="-5vh"
      >
        <Login variant="primary" signInText="Connect wallet" />
        <Text
          color="text.300"
          fontSize={{ base: "1rem", md: "1.25rem" }}
          mt="64px"
        >
          Don't have a wallet yet? We support the following:
        </Text>
        <Stack
          spacing={{ base: "1em", md: "1.5em" }}
          direction={{ base: "column", md: "row" }}
        >
          <Link
            href="https://www.keplr.app/"
            isExternal
            textDecoration="underline"
            color="text.300"
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
            color="text.300"
            _hover={{
              color: "brand.500"
            }}
            _focus={{
              color: "brand.500"
            }}
          >
            Leap
          </Link>
          <Link
            href="https://cosmostation.io/products/cosmostation_extension"
            isExternal
            textDecoration="underline"
            color="text.300"
            _hover={{
              color: "brand.500"
            }}
            _focus={{
              color: "brand.500"
            }}
          >
            Cosmostation
          </Link>
        </Stack>
      </VStack>
    </VStack>
  );
};
