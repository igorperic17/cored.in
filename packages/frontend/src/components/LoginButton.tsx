import {
  Button,
  Img,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
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
import { ROUTES } from "@/router/routes";
import { Link as ReactRouterLink } from "react-router-dom";
import { chain } from "chain-registry/testnet/coreumtestnet";

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

interface LoginButtonProps {
  variant: "primary" | "empty";
  size?: "sm" | "md";
  signInText: string;
  username?: string;
}

export const LoginButton: FC<LoginButtonProps> = ({
  variant,
  size = "md",
  signInText,
  username
}) => {
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
      <Stack
        direction={{ base: "column", sm: "row" }}
        spacing={{ base: "0em", sm: "0.75em" }}
        align={{ base: "end", sm: "center" }}
      >
        {username && (
          <Link
            as={ReactRouterLink}
            to={
              username && chainContext.address
                ? ROUTES.USER.buildPath(chainContext.address)
                : "#"
            }
            _hover={{ textDecoration: "none" }}
            color="brand.500"
            fontSize={{ base: "0.85rem", md: "1rem" }}
          >
            @{username}
          </Link>
        )}
        <Button
          bg="none"
          color="text.700"
          variant={variant}
          size="xs"
          _hover={{
            bg: "none",
            color: "brand.900"
          }}
          onClick={handleDisconnectWallet}
        >
          <Text fontFamily="inherit" fontSize="inherit" mt="auto">
            Sign Out
          </Text>
        </Button>
      </Stack>
    );
  } else {
    return (
      <>
        <Button
          as={ReactRouterLink}
          to={ROUTES.LOGIN.path}
          variant={variant}
          size={size}
          // border="1px solid red"
          onClick={onOpen}
        >
          {signInText}
          {/* connect */}
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

        <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              fontSize={{ base: "1.25rem", lg: "1.5rem" }}
              textTransform="uppercase"
              color="brand.500"
            >
              Connect Wallet
            </ModalHeader>
            <ModalCloseButton
              size="xl"
              top="24px"
              right="24px"
              color="brand.900"
            />
            <ModalBody>
              <VStack as="ul" gap="1em" align="start">
                {chainContext.walletRepo.wallets.map((wallet) => {
                  return (
                    <li key={`wallet-${wallet.walletInfo.prettyName}`}>
                      <Button
                        variant="empty"
                        size="md"
                        color="brand.900"
                        textTransform="none"
                        onClick={() => wallet.connect(true)}
                        key={wallet.walletName}
                        leftIcon={
                          <Img
                            src={
                              typeof wallet.walletInfo.logo === "string"
                                ? wallet.walletInfo.logo
                                : wallet.walletInfo.logo?.minor
                            }
                            maxW="1.5rem"
                            borderRadius="50%"
                            mr="0.5em"
                          />
                        }
                      >
                        {wallet.walletInfo.prettyName}
                      </Button>
                    </li>
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
