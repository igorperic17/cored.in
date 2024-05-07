import { Header } from "@/modules/app/components";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet, ScrollRestoration } from "react-router-dom";

export const AppRoot = () => {
  return (
    <Flex direction="column" justify="start">
      <Header />
      <Box as="main" id="detail" overflowX="hidden" flex="1">
        <Outlet />
        <ScrollRestoration />
      </Box>
    </Flex>
  );
};
