import { Header, Logo, SocialMedia } from "@/components";
import { Disclaimer } from "@/components/Disclaimer";
import { Navigation, UserSignOut } from "@/modules/home/components";
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

export const HomeRoot = () => {
  const theme = useTheme();
  const [isLargerThanLg] = useMediaQuery(
    `(min-width: ${theme.breakpoints.lg})`
  );
  const location = useLocation();
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  if (!chainContext.isWalletConnected) {
    return (
      <Navigate to={ROUTES.LOGIN.path + "?redirect=" + location.pathname} />
    );
  }

  return (
    <Box>
      {/* TODO - username */}
      {!isLargerThanLg && <Header username="username" />}

      <Flex
        justify="center"
        align="start"
        gap="1.5em"
        maxW="1300px"
        mx="auto"
        p="1em"
        minH="100dvh"
      >
        {isLargerThanLg ? (
          <VStack spacing="1.25em" w="23%" position="sticky" top="1em">
            <Box layerStyle="cardBox" p="2em" w="100%">
              <Link
                as={ReactRouterLink}
                to={ROUTES.ROOT.path}
                _hover={{ textDecoration: "none" }}
                aria-label="Main page."
              >
                <Logo fontSize={{ base: "1.5rem", lg: "2rem" }} />
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
          flex="2"
          w="52%"
          maxW={{ base: "600px", lg: "none" }}
          mx="auto"
        >
          <Outlet />
          <ScrollRestoration />
        </Box>
        {isLargerThanLg && (
          <VStack
            as="aside"
            position="sticky"
            top="1em"
            w="25%"
            h="max-content"
            layerStyle="cardBox"
            pb="1.5em"
          >
            <Disclaimer />
            <SocialMedia size="2rem" gap="2.25em" color="text.400" />
          </VStack>
        )}
      </Flex>
    </Box>
  );
};
