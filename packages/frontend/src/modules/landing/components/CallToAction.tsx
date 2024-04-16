import { Button, Heading, Link, VStack } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { ROUTES } from "@/router/routes";

export const CallToAction = () => {
  return (
    <VStack minH="50vh">
      <Heading as="h2" fontSize="4rem" mb="1em" textAlign="center">
        Elevate your career
      </Heading>
      <Link as={ReactRouterLink} to={ROUTES.APP.path}>
        <Button variant="primary" size="xl">
          Sign In
        </Button>
      </Link>
    </VStack>
  );
};
