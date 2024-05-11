import { Disclaimer, Header } from "@/modules/app/components";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet, ScrollRestoration } from "react-router-dom";

export const AppRoot = () => {
  return (
    <Flex direction="column" justify="start" h="100vh">
      <Header />
      <Box as="main" id="detail" overflowX="hidden" flex="1">
        <Outlet />
        <ScrollRestoration />
      </Box>
      <Disclaimer />
    </Flex>
  );
};
