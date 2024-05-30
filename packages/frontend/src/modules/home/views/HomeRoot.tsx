import { SocialMedia } from "@/components";
import { Disclaimer } from "@/components/Disclaimer";
import { Navigation, NavigationMobile } from "@/modules/home/components";
import { Header } from "@/modules/login/components";
import { ROUTES } from "@/router/routes";
import { Box, Flex, VStack, useMediaQuery, useTheme } from "@chakra-ui/react";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { Navigate, Outlet, ScrollRestoration } from "react-router-dom";

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
    <>
      {isLargerThanLg && (
        <Flex
          justify="center"
          align="start"
          gap="1.5em"
          // outline="1px solid yellow"
          maxW="1200px"
          mx="auto"
          my="1em"
          p="1em"
        >
          <Navigation />
          <Box as="main" flex="2">
            <Outlet />
            <ScrollRestoration />
          </Box>
          <VStack
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
        </Flex>
      )}
      {!isLargerThanLg && (
        <>
          <Header />
          <Box as="main" flex="2" p="1em">
            <Outlet />
            <ScrollRestoration />
          </Box>
          <NavigationMobile />
        </>
      )}
    </>
  );
};
