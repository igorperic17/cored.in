import { Login, Logo } from "@/components";
import { ROUTES } from "@/router/routes";
import { Flex, Link } from "@chakra-ui/react";
import { FC } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

type HeaderProps = {
  username?: string;
};

export const Header: FC<HeaderProps> = ({ username }) => {
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
      px={{ base: "1em", lg: "3.5em" }}
      py={{ base: "0.5em", lg: "0.25em" }}
      background="background.900"
    >
      <Link
        as={ReactRouterLink}
        to={ROUTES.ROOT.path}
        _hover={{ textDecoration: "none" }}
        aria-label="Main page."
      >
        <Logo fontSize={{ base: "1.5rem", lg: "2rem" }} />
      </Link>

      <Login username={username} variant="empty" signInText="Connect wallet" />
    </Flex>
  );
};
