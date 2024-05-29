import { Disclaimer } from "@/components/Disclaimer";
import { Navigation } from "@/modules/home/components";
import { ROUTES } from "@/router/routes";
import { Box, Flex } from "@chakra-ui/react";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { Navigate, Outlet, ScrollRestoration } from "react-router-dom";

export const HomeRoot = () => {
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  if (!chainContext.isWalletConnected) {
    return <Navigate to={ROUTES.LOGIN.path} />;
  }

  return (
    <Flex justify="center">
      <Navigation />
      <Box as="main">
        <Outlet />
        <ScrollRestoration />
      </Box>
      <Box
        maxW="400px"
        h="max-content"
        bg="background.800"
        borderRadius="0.5em"
        p="1.5em"
      >
        <Disclaimer />
      </Box>
    </Flex>
  );
};
