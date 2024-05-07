import { useWrappedClientContext } from "@/contexts/client";
import { Button, HStack, Text } from "@chakra-ui/react";

export const Login = () => {
  const { connectWallet, disconnect, walletAddress } =
    useWrappedClientContext();
  const isConnected = walletAddress.length;

  const shortWalletAddress =
    walletAddress.slice(0, 4) + "..." + walletAddress.slice(-4);

  if (isConnected) {
    return (
      <HStack
        // borderWidth="1px"
        // borderStyle="solid"
        // borderColor="background.100"
        // borderRadius="3xl"
        // py="0.25em"
        // border="1px solid red"
        pl="1em"
        pr="0.25em"
        spacing="0.25em"
        align="end"
      >
        <Text
          color="text.100"
          textTransform="uppercase"
          fontSize={{ base: "0.75em", md: "0.825rem" }}
          mb="1px"
        >
          {shortWalletAddress}
        </Text>
        <Button
          borderStartStartRadius="0"
          borderEndStartRadius="0"
          borderStartEndRadius="xl"
          borderEndEndRadius="xl"
          bg="none"
          color="text.800"
          size="xs"
          _hover={{
            bg: "none",
            color: "text.100"
          }}
          onClick={() => disconnect()}
          // border="1px solid green"
        >
          <Text fontFamily="inherit" fontSize="inherit" mt="auto">
            Sign Out
          </Text>
        </Button>
      </HStack>
    );
  } else {
    return (
      <Button variant="primary" size="md" onClick={connectWallet}>
        Sign In
      </Button>
    );
  }
};
