import { useWrappedClientContext } from "@/contexts/client";
import { Box, Button, HStack, Text } from "@chakra-ui/react";

export const Login = () => {
  const { connectWallet, disconnect, walletAddress } =
    useWrappedClientContext();
  const isConnected = walletAddress.length;

  const shortWalletAddress =
    walletAddress.slice(0, 3) + "..." + walletAddress.slice(-3);

  if (isConnected) {
    return (
      // V1
      // <HStack>
      //   <Text>{walletAddress}</Text>
      //   <Button variant="primary" size="xs" onClick={() => disconnect()}>
      //     Disconnect
      //   </Button>
      // </HStack>

      // V2
      // <HStack
      //   bg="colors.background.900"
      //   borderRadius="3xl"
      //   px="0.25em"
      //   py="0.25em"
      //   pl="1em"
      // >
      //   <Text color="colors.brand.600">{walletAddress}</Text>
      //   <Button
      //     borderStartStartRadius="0"
      //     borderEndStartRadius="0"
      //     borderStartEndRadius="xl"
      //     borderEndEndRadius="xl"
      //     bg="colors.background.900"
      //     color="colors.text.100"
      //     size="xs"
      //     onClick={() => disconnect()}
      //   >
      //     Disconnect
      //   </Button>
      // </HStack>

      // V3
      <HStack
        bg="colors.background.900"
        borderRadius="3xl"
        px="0.25em"
        py="0.25em"
        pl="1em"
      >
        <Text color="colors.brand.600" textTransform="uppercase">
          {shortWalletAddress}
        </Text>
        <Button
          borderStartStartRadius="0"
          borderEndStartRadius="0"
          borderStartEndRadius="xl"
          borderEndEndRadius="xl"
          bg="none"
          color="colors.text.100"
          size="xs"
          _hover={{
            bg: "none"
          }}
          onClick={() => disconnect()}
        >
          Disconnect
        </Button>
      </HStack>
    );
  } else {
    return (
      <>
        <Button variant="primary" size="md" onClick={connectWallet}>
          Connect Wallet
        </Button>
      </>
    );
  }
};
