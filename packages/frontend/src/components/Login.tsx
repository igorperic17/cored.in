import {
  Button,
  HStack,
  Img,
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
import { wallets as keplrWallets } from "@cosmos-kit/keplr-extension";
import { wallets as leapWallets } from "@cosmos-kit/leap";
// import { wallets as frontier } from "@cosmos-kit/frontier";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import React, { useEffect } from "react";
import { FC } from "react";
import { persistentStorageService } from "@/dependencies";
import { ConnectedWalletKey } from "@/constants";
import { chain } from "chain-registry/testnet/coreumtestnet";

interface LoginProps {
  variant: "primary" | "empty";
  signInText: string;
}

export const Login: FC<LoginProps> = ({ variant, signInText }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  console.log(chainContext.address);
  console.log(chainContext.isWalletConnected);

  useEffect(() => {
    if (chainContext.address) {
      persistentStorageService.save(ConnectedWalletKey, chainContext.address);

      return;
    }

    persistentStorageService.remove(ConnectedWalletKey);
  }, [chainContext.address, chainContext.isWalletConnected]);

  const handleDisconnectWallet = React.useCallback(() => {
    if (chainContext.isWalletConnected) {
      chainContext.disconnect();
    }
  }, [chainContext]);

  const shortWalletAddress = chainContext.address
    ? chainContext.address.slice(0, 4) + "..." + chainContext.address.slice(-4)
    : "";

  const wallets = [...keplrWallets, ...leapWallets, ...cosmostationWallets];

  if (chainContext.isWalletConnected) {
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
          onClick={handleDisconnectWallet}
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
              <VStack gap="16px">
                {wallets.map((wallet) => {
                  return (
                    <Button
                      variant="empty"
                      size="md"
                      onClick={() => wallet.connect(true)}
                      key={wallet.walletName}
                      rightIcon={
                        <Img
                          src={
                            typeof wallet.walletInfo.logo === "string"
                              ? wallet.walletInfo.logo
                              : wallet.walletInfo.logo?.minor
                          }
                          maxW="32px"
                          // maxH="32px"
                        />
                      }
                    >
                      {wallet.walletInfo.prettyName}
                    </Button>
                  );
                })}
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }
};
