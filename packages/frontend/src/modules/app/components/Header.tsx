import { Login } from "@/components";
import { Logo } from "@/components/Logo";
import { ROUTES } from "@/router/routes";
import { Flex, Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

export const Header = () => {
  return (
    <Flex
      as="header"
      direction="row"
      justify="space-between"
      align="center"
      // border="1px solid red"
      w="100%"
      maxW="1920px"
      mx="auto"
      px={{ base: "1em", md: "2.5em", lg: "3.5em", xl: "4em" }}
      py={{ base: "0.5em", md: "0.25em" }}
      background="background.900"
    >
      <Link
        as={ReactRouterLink}
        to={ROUTES.ROOT.path}
        _hover={{ textDecoration: "none" }}
      >
        <Logo fontSize={{ base: "1.5rem", md: "2rem" }} />
      </Link>

      <Login variant="empty" signInText="Connect wallet" />
    </Flex>
  );
};
