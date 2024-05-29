import { Login } from "@/components";
import { Logo } from "@/components/Logo";
import { ROUTES } from "@/router/routes";
import { Box, Link, VStack } from "@chakra-ui/layout";
import { Link as ReactRouterLink } from "react-router-dom";

export const Navigation = () => {
  return (
    <VStack
      maxW="400px"
      h="max-content"
      bg="background.800"
      borderRadius="0.5em"
      p="2em"
      align="start"
      spacing="3em"
    >
      <Link
        as={ReactRouterLink}
        to={ROUTES.ROOT.path}
        _hover={{ textDecoration: "none" }}
        aria-label="Main page."
      >
        <Logo fontSize={{ base: "1.5rem", md: "2rem" }} />
      </Link>
      <Box as="nav">
        <VStack as="ul" listStyleType="none" align="start">
          <li>
            <Link fontSize="1.5rem">Profile</Link>
          </li>
          <li>
            <Link fontSize="1.5rem">Settings</Link>
          </li>
        </VStack>
      </Box>
      <Login variant={"empty"} signInText={"Test"} />
    </VStack>
  );
};
