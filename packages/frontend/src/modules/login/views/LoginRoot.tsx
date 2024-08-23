import { Box, Flex } from "@chakra-ui/react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { DisclaimerText } from "@/components/DisclaimerText";
import { Header, MainBackground } from "@/components";

export const LoginRoot = () => {
  return (
    <Box
      maxH="100%"
      w="100%"
      bg="brand.100"
      position="fixed"
      overflow="auto"
      // border="5px solid green"
    >
      <Flex
        direction="column"
        justify="start"
        minH="100dvh"

        // bgImage={LandingBgDark35}
        // bgPosition="center"
        // border="2px solid red"
      >
        <Header />
        <Box as="main" mb="auto">
          <Outlet />
          <ScrollRestoration />
        </Box>
        <Box
          mx="auto"
          py="2em"
          px={{ base: "1em", md: "2.5em", lg: "3.5em" }}
          maxW="1100px"
        >
          <DisclaimerText />
        </Box>
      </Flex>
      <MainBackground />
    </Box>
  );
};
