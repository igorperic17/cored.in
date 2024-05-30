import { SocialMedia } from "@/components";
import { Disclaimer } from "@/components/Disclaimer";
import { Navigation } from "@/modules/home/components";
import { ROUTES } from "@/router/routes";
import { Box, Flex, Grid, GridItem, VStack } from "@chakra-ui/react";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { Navigate, Outlet, ScrollRestoration } from "react-router-dom";

export const HomeRoot = () => {
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  if (!chainContext.isWalletConnected) {
    return <Navigate to={ROUTES.LOGIN.path} />;
  }

  return (
    <Flex
      justify="center"
      align="start"
      gap="2em"
      // outline="1px solid yellow"
      maxW="1200px"
      mx="auto"
      my="1em"
    >
      <Navigation />
      <Box
        as="main"
        // outline="1px solid red"
        flex="1"
      >
        <Outlet />
        <ScrollRestoration />
      </Box>
      <VStack
        position="sticky"
        top="1em"
        w="30%"
        h="max-content"
        bg="background.600"
        borderRadius="0.5em"
        pb="1.5em"
        // outline="1px solid red"
      >
        <Disclaimer />
        <SocialMedia size="2rem" gap="2.25em" />
      </VStack>
    </Flex>
  );
};
