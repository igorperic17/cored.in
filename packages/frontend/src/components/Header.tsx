import { LoginButton, Logo } from "@/components";
import { ROUTES } from "@/router/routes";
import { Box, Flex, Link } from "@chakra-ui/react";
import { FC } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

type HeaderProps = {
  username?: string;
};

export const Header: FC<HeaderProps> = ({ username }) => {
  return (
    <Box
      as="header"
      position="sticky"
      top={{ base: "1rem", md: "1.5rem", lg: "1.75rem" }}
      zIndex="10"
      px={{ base: "1em", md: "2.5em" }}
      mb={{ base: "1em", md: "2em", lg: "0" }}
    >
      <Flex
        justify="space-between"
        alignItems="center"
        gap="3em"
        maxW="1840px"
        mx="auto"
        backdropFilter="blur(12px)"
        border="1px solid #29292940"
        borderRadius="1em"
        boxShadow="0px 4px 4px 0px #00000014"
        p={{ base: "0.688em", xl: "1em" }}
        // border="1px solid red"
      >
        <Link
          as={ReactRouterLink}
          to={ROUTES.ROOT.path}
          aria-label="Main page."
          _hover={{
            textDecoration: "none"
          }}
          flexShrink="0"
        >
          <Logo
            w={{ base: "120px", md: "148px" }}
            h="auto"
            aspectRatio="6.17 / 1"
          />
        </Link>

        <LoginButton
          username={username}
          variant="empty"
          size="sm"
          signInText="Connect wallet"
        />
      </Flex>
    </Box>
  );
};
