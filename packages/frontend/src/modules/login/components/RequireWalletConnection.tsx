import { LoginButton } from "@/components";
import { VStack, Text, Heading, Link, Box, HStack } from "@chakra-ui/react";
import { SUPPORTED_WALLETS } from "../constants";

export const RequireWalletConnection = () => {
  return (
    <VStack
      minH="66vh"
      align="center"
      justify="center"
      spacing="10vh"
      textAlign="center"
      maxW="600px"
      mx="auto"
      pt="2vh"
      // border="1px solid red"
    >
      <Heading
        as="h1"
        fontSize={{ base: "3rem", md: "4rem" }}
        fontWeight="700"
        lineHeight="1.25"
      >
        Connect your wallet to begin
      </Heading>
      <VStack spacing="1rem" fontSize={{ base: "1rem", md: "1.25rem" }}>
        <LoginButton variant="primary" size="md" signInText="Connect wallet" />
        <Text
          color="brand.900"
          fontSize={{ base: "1rem", md: "1.25rem" }}
          mt="4vh"
        >
          Don't have a wallet yet? We support the following:
        </Text>
        <HStack
          as="ul"
          listStyleType="none"
          spacing={{ base: "1.5em", md: "1em" }}
        >
          {SUPPORTED_WALLETS.map((wallet) => (
            <Box as="li" key={`supported-wallet-${wallet.title}`}>
              <Link
                href={wallet.href}
                isExternal
                color="brand.900"
                _hover={{
                  color: "brand.300"
                }}
                _focus={{
                  color: "brand.300"
                }}
              >
                {wallet.title}
              </Link>
            </Box>
          ))}
        </HStack>
      </VStack>
    </VStack>
  );
};
