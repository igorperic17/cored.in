import { Box, Flex } from "@chakra-ui/react";
import { CookiesBar } from "@/components";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Footer, Nav } from "../components";

export const Root = () => {
  return (
    <Flex direction="column" justify="start">
      <Nav />
      <Box as="main">
        <Outlet />
        <ScrollRestoration />
      </Box>
      <Footer />
      <CookiesBar />
    </Flex>
  );
};
