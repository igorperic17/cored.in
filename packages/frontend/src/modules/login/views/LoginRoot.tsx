import { Box, Flex } from "@chakra-ui/react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Header } from "../components";
import { Disclaimer } from "@/components/Disclaimer";

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
