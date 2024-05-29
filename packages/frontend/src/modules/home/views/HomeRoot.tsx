import { Disclaimer } from "@/components/Disclaimer";
import { Navigation } from "@/modules/home/components";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet, ScrollRestoration } from "react-router-dom";

export const HomeRoot = () => {
  return (
    <Flex justify="center">
      <Navigation />
      <Box as="main">
        <Outlet />
        <ScrollRestoration />
      </Box>
      {/* <Disclaimer /> */}
    </Flex>
  );
};
