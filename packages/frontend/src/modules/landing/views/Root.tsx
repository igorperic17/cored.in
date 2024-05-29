import { Box, Flex } from "@chakra-ui/react";
import { CookiesBar, Footer, Nav } from "@/components";
import { Outlet, ScrollRestoration } from "react-router-dom";

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
