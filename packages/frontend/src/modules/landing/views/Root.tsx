import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { BurguerMenu, CookiesBar, Footer, Nav } from "@/components";
import { Outlet, ScrollRestoration } from "react-router-dom";

export const Root = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex direction="column" justify="start">
      <Nav onOpen={onOpen} />
      <Box as="main" overflowX="hidden" flex="1">
        <Outlet />
        <ScrollRestoration />
      </Box>
      <CookiesBar />
      <BurguerMenu isOpen={isOpen} onClose={onClose} />
      <Footer />
    </Flex>
  );
};
