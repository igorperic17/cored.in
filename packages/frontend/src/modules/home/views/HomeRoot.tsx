import { Header, Logo, SocialMedia } from "@/components";
import { Disclaimer } from "@/components/Disclaimer";
import { useAuth, useLoggedInServerState } from "@/hooks";
import { Navigation, UserSignOut } from "@/modules/home/components";
import { USER_QUERIES } from "@/queries";
import { ROUTES } from "@/router/routes";
import {
  Box,
  Flex,
  Link,
  VStack,
  useMediaQuery,
  useTheme
} from "@chakra-ui/react";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import {
  Navigate,
  Outlet,
  ScrollRestoration,
  useLocation
} from "react-router-dom";
import { Link as ReactRouterLink } from "react-router-dom";
import LandingBgDark35 from "@/assets/landing-bg-dark-35.png";

export const HomeRoot = () => {
  const theme = useTheme();
  const [isLargerThanLg] = useMediaQuery(
    `(min-width: ${theme.breakpoints.lg})`
  );
  const location = useLocation();
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const { needsAuth } = useAuth();
  const { data: userProfile } = useLoggedInServerState(
    USER_QUERIES.getUser(chainContext.address || "", needsAuth),
    {
      enabled: !!chainContext.address
    }
  );
  if (!chainContext.isWalletConnected) {
    return (
      <Navigate to={ROUTES.LOGIN.path + "?redirect=" + location.pathname} />
    );
  }

  return (
    <Box bgImage={LandingBgDark35} bgPosition="center">
      {!isLargerThanLg && userProfile && (
        <Header username={userProfile.username} />
      )}

      <Flex
        justify="center"
        align="start"
        gap="1.25em"
        maxW="1300px"
        mx="auto"
        p="1em"
        minH="100dvh"
      >
        {isLargerThanLg ? (
          <VStack spacing="1.25em" w="24%" position="sticky" top="1em">
            <Box layerStyle="cardBox" p="2em" w="100%">
              <Link
                as={ReactRouterLink}
                to={ROUTES.ROOT.path}
                _hover={{ textDecoration: "none" }}
                aria-label="Main page."
              >
                <Logo w="148px" h="auto" aspectRatio="6.17 / 1" />
              </Link>
            </Box>
            <Navigation wallet={chainContext.address || ""} />
            <UserSignOut />
          </VStack>
        ) : (
          <Navigation wallet={chainContext.address || ""} />
        )}

        <Box
          as="main"
          flex="1"
          w="52%"
          maxW={{ base: "600px", lg: "none" }}
          mx="auto"
        >
          <Outlet />
          <ScrollRestoration />
        </Box>
        {isLargerThanLg && (
          <VStack
            spacing="1.25em"
            w="24%"
            as="aside"
            position="sticky"
            top="1em"
          >
            <VStack
              h="max-content"
              layerStyle="cardBox"
              pt="0"
              px="0"
              pb="1.5em"
            >
              <Disclaimer />
              <SocialMedia size="2rem" gap="2.25em" color="text.400" />
            </VStack>
          </VStack>
        )}
      </Flex>
    </Box>
  );
};
