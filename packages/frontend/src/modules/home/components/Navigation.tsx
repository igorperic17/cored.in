import { Login } from "@/components";
import { Logo } from "@/components/Logo";
import { ROUTES } from "@/router/routes";
import { Link, VStack } from "@chakra-ui/layout";
import { Link as ReactRouterLink } from "react-router-dom";

export const Navigation = () => {
  return (
    <VStack>
      <Link
        as={ReactRouterLink}
        to={ROUTES.ROOT.path}
        _hover={{ textDecoration: "none" }}
        aria-label="Main page."
      >
        <Logo fontSize={{ base: "1.5rem", md: "2rem" }} />
      </Link>
    </VStack>
  );
};
