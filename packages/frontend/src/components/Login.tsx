import {
  Box,
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
import React, { useEffect, useState } from "react";
import { FC } from "react";
import { persistentStorageService } from "@/dependencies";
import { ConnectedWalletKey } from "@/constants";
import {
  CapsuleProvider,
  OAuthMethod
} from "@leapwallet/cosmos-social-login-capsule-provider";
import { CustomCapsuleModalView } from "@leapwallet/cosmos-social-login-capsule-provider-ui";
// Note: Import the necessary styles for the Leap Capsule Provider UI
import "@leapwallet/cosmos-social-login-capsule-provider-ui/styles.css";

const options = {
  env: "BETA",
  apiKey: import.meta.env.VITE_CAPSULE_API_KEY,
  opts: {
    emailPrimaryColor: "#ff5733",
    homepageUrl: "https://cored.in",
    portalTheme: {
      backgroundColor: "#ffffff",
      foregroundColor: "#ff5733"
      // borderRadius: "lg"
    },
    githubUrl: "https://github.com/capsule-org",
    linkedinUrl: "https://www.linkedin.com/company/usecapsule/",
    xUrl: "https://x.com/usecapsule",
    supportUrl: "https://usecapsule.com/talk-to-us"
  }
};

// Create a new CapsuleProvider instance with the options
const capsuleProvider = new CapsuleProvider(options);

interface LoginProps {
  variant: "primary" | "empty";
  signInText: string;
  username?: string;
}

export const Login: FC<LoginProps> = ({ variant, signInText, username }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const [showModal, setShowModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Step 4: Check initial authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await capsuleProvider.enable();
        setIsAuthenticated(true);
        console.log({
          title: "Authentication Status",
          description: "You are already authenticated."
        });
      } catch (error) {
        console.log("Not authenticated:", error);
        console.log({
          title: "Authentication Status",
          description: "You are not authenticated.",
          variant: "destructive"
        });
      }
    };
    checkAuthStatus();
  }, []);

  // Step 5: Handle opening the modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Step 6: Handle successful login
  // Here, you can perform actions such as updating the UI, fetching user data, or redirecting to another page
  const handleAfterLogin = async () => {
    try {
      setIsAuthenticated(true);
      setShowModal(false);
      const account = await capsuleProvider.getAccount("cosmos");
      console.log("Logged in account:", account);
      console.log({
        title: "Login Successful",
        description: `Logged in as ${account.username}`
      });
      window.successFromCapsuleModal();
    } catch (error) {
      console.error("Error fetching account details:", error);
      console.log({
        title: "Login Error",
        description: "Failed to fetch account details after login.",
        variant: "destructive"
      });
    }
  };

  // Step 7: Handle login failure
  // You can use this to show error messages or perform error-specific actions
  const handleLoginFailure = () => {
    console.error("Login failed");
    setShowModal(false);
    window.failureFromCapsuleModal();
    console.log({
      title: "Login Failed",
      description: "Unable to authenticate. Please try again.",
      variant: "destructive"
    });
  };

  // Step 8: Handle logout
  // It disconnects the user from the Capsule provider and updates the authentication state
  const handleLogout = async () => {
    try {
      await capsuleProvider.disconnect();
      setIsAuthenticated(false);
      console.log({
        title: "Logout Successful",
        description: "You have been logged out."
      });
    } catch (error) {
      console.error("Logout error:", error);
      console.log({
        title: "Logout Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

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

  if (chainContext.isWalletConnected) {
    return (
      <HStack spacing="0.75em" align="end">
        {username && (
          <Text color="text.100" fontSize={{ base: "0.85rem", md: "1rem" }}>
            @{username}
          </Text>
        )}
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

        {/* <Button
          variant="empty"
          size="md"
          onClick={() => window.openCapsuleModal()}
          key="capsule-wallet"
        >
          Log in
        </Button> */}
        {/* <VStack gap="16px">
          {chainContext.walletRepo.wallets.map((wallet) => {
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
        </VStack> */}

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay backdropFilter="blur(10px)" />
          <ModalContent background="background.600">
            <ModalHeader>Connect Wallet</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack gap="16px">
                {chainContext.walletRepo.wallets.map((wallet) => {
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

        {/* Step 12: Render the CustomCapsuleModalView component */}
        {/* <Box className="leap-ui" position="absolute">
          <CustomCapsuleModalView
            oAuthMethods={[
              OAuthMethod.APPLE,
              OAuthMethod.DISCORD,
              OAuthMethod.FACEBOOK,
              OAuthMethod.GOOGLE,
              OAuthMethod.TWITTER
            ]}
            capsule={capsuleProvider.getClient()}
            showCapsuleModal={showModal}
            setShowCapsuleModal={setShowModal}
            onAfterLoginSuccessful={handleAfterLogin}
            onLoginFailure={handleLoginFailure}
            theme="light" // You can change this to "dark" if preferred
          />
        </Box> */}
      </>
    );
  }
};
