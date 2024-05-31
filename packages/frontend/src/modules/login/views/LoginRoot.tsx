import { Box, Flex } from "@chakra-ui/react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Disclaimer } from "@/components/Disclaimer";
import { Header } from "@/components";

export const LoginRoot = () => {
  return (
    <Flex direction="column" justify="start" h="100vh">
      <Header />
      <Box as="main">
        <Outlet />
        <ScrollRestoration />
      </Box>
      <Disclaimer />
    </Flex>
  );
};
