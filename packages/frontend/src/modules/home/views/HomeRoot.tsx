import { Disclaimer, Header } from "@/modules/home/components";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet, ScrollRestoration } from "react-router-dom";

export const HomeRoot = () => {
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
