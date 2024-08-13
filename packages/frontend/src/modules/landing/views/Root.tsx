import { Box, Flex } from "@chakra-ui/react";
import { CookiesBar } from "@/components";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Footer, Nav } from "../components";
import LandingBg50 from "@/assets/landing-bg-50.png";

export const Root = () => {
  return (
    <Flex
      direction="column"
      justify="start"
      bgImage={LandingBg50}
      bgPosition="center"
    >
      <Nav />
      <Box as="main" zIndex="0">
        <Outlet />
        <ScrollRestoration />
      </Box>
      <Footer />
      <CookiesBar />
    </Flex>
  );
};
