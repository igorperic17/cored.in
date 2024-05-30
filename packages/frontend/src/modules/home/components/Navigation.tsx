import { Login } from "@/components";
import { Logo } from "@/components/Logo";
import { ROUTES } from "@/router/routes";
import { Box, Link, VStack } from "@chakra-ui/layout";
import { Link as ReactRouterLink } from "react-router-dom";
import { navigationData } from "../constants/navigationData";

export const Navigation = () => {
  return (
    <VStack
      w="25%"
      h="max-content"
      bg="background.600"
      borderRadius="0.5em"
      p="2em"
      align="start"
      spacing="3em"
      position="sticky"
      top="1em"
      // outline="1px solid red"
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
          {navigationData.map((item, index) => (
            <li key={`home-navigation-${index}`}>
              <Link fontSize="1.5rem">{`${item.title[0].toUpperCase()}${item.title.slice(1)}`}</Link>
            </li>
          ))}
        </VStack>
      </Box>
      <Login variant={"empty"} signInText={"Test"} />
    </VStack>
  );
};
