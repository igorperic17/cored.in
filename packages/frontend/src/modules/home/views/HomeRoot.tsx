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
import { Navigate, Outlet, ScrollRestoration } from "react-router-dom";
import { Link as ReactRouterLink } from "react-router-dom";

export const HomeRoot = () => {
  const theme = useTheme();
  const [isLargerThanLg] = useMediaQuery(
    `(min-width: ${theme.breakpoints.lg})`
  );
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  if (!chainContext.isWalletConnected) {
    return <Navigate to={ROUTES.LOGIN.path} />;
  }

  return (
    <Box>
      {!isLargerThanLg && <Header username="natalia" />}

      <Flex
        justify="center"
        align="start"
        gap="1.5em"
        maxW="1200px"
        mx="auto"
        p="1em"
      >
        {isLargerThanLg ? (
          <VStack spacing="1.25em" w="25%" position="sticky" top="1em">
            <Box bg="background.700" borderRadius="0.5em" p="2em" w="100%">
              <Link
                as={ReactRouterLink}
                to={ROUTES.ROOT.path}
                _hover={{ textDecoration: "none" }}
                aria-label="Main page."
              >
                <Logo fontSize={{ base: "1.5rem", md: "2rem" }} />
              </Link>
            </Box>
            <Navigation />
            <UserSignOut />
          </VStack>
        ) : (
          <Navigation />
        )}

        <Box as="main" flex="2">
          <Outlet />
          <ScrollRestoration />
        </Box>
        {isLargerThanLg && (
          <VStack
            as="aside"
            position="sticky"
            top="1em"
            w="30%"
            h="max-content"
            bg="background.700"
            borderRadius="0.5em"
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
