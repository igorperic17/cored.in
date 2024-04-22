import { Button, Flex, Heading, Link } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { ROUTES } from "@/router/routes";

export const CallToAction = () => {
  return (
    <Flex flexDirection="column" justify="center" align="center" py="2em" mx="2em">
      <Heading as="h2" fontSize="4rem" mb="2rem" textAlign="center">
        Elevate your career
      </Heading>
      <Link as={ReactRouterLink} to={ROUTES.APP.path}>
        <Button variant="primary" size="xl">
          Sign In
        </Button>
      </Link>
    </Flex>
  );
};
