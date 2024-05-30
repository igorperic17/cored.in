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
  username: string;
}

export const Login: FC<LoginProps> = ({ variant, signInText, username }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const chainContext = useChain(TESTNET_CHAIN_NAME);

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

  const wallets = [...keplrWallets, ...leapWallets, ...cosmostationWallets];

  if (chainContext.isWalletConnected) {
    return (
      <HStack spacing="0.75em" align="end">
        <Text color="text.100" fontSize={{ base: "0.85rem", md: "1rem" }}>
          @{username}
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
