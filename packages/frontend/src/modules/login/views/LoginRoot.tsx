import { Box, Flex } from "@chakra-ui/react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { DisclaimerText } from "@/components/DisclaimerText";
import { Header } from "@/components";
import LandingBgDark35 from "@/assets/landing-bg-dark-35.png";

export const LoginRoot = () => {
  return (
    <Flex
      direction="column"
      justify="start"
      minH="100dvh"
      bgImage={LandingBgDark35}
      bgPosition="center"
      // border="2px solid red"
    >
      <Header />
      <Box as="main" mb="auto">
        <Outlet />
        <ScrollRestoration />
      </Box>
      <DisclaimerText />
    </Flex>
  );
};
