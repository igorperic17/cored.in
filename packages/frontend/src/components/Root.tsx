import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { BurguerMenu, CookiesBar, Nav } from ".";
import { Outlet, ScrollRestoration } from "react-router-dom";

export const Root = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex direction="column" justify="start">
      <Nav onOpen={onOpen} />
      <Box overflowX="hidden" flex="1">
        <Outlet />
        <ScrollRestoration />
      </Box>
      <CookiesBar />
      <BurguerMenu isOpen={isOpen} onClose={onClose} />
      {/* <Footer /> */}
    </Flex>
  );
};
