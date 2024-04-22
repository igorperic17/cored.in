import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import { BurguerMenu, CookiesBar, Footer, Nav } from ".";
import { Outlet, ScrollRestoration } from "react-router-dom";

export const AppRoot = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex direction="column" justify="start">
      <Box id="detail" overflowX="hidden" flex="1">
        <Outlet />
        <ScrollRestoration />
      </Box>
    </Flex>
  );
};
