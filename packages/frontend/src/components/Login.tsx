import { useWrappedClientContext } from "@/contexts/client";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure
} from "@chakra-ui/react";
import { FC } from "react";

interface LoginProps {
  variant: "primary" | "empty";
  signInText: string;
}

export const Login: FC<LoginProps> = ({ variant, signInText }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
        spacing="0.75em"
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
          variant={variant}
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
      <>
        <Button variant={variant} size="md" onClick={onOpen}>
          {signInText}
        </Button>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent background="background.600">
            <ModalHeader>Connect Wallet</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack>
                <Button
                  variant="empty"
                  size="md"
                  onClick={() => connectWallet("keplr")}
                >
                  Connect Keplr
                </Button>
                <Button
                  variant="empty"
                  size="md"
                  onClick={() => connectWallet("leap")}
                >
                  Connect Leap
                </Button>
                <Button
                  variant="empty"
                  size="md"
                  onClick={() => connectWallet("cosmostation")}
                >
                  Connect Cosmostation
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }
};
