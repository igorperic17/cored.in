import { Button, Container, Heading, Link, Text } from "@chakra-ui/react";
import { useRouteError } from "react-router-dom";
import { Link as ReactRouterLink } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Container id="error-page" centerContent p="32px" gap="32px" maxW="600px">
      <Heading>Oops!</Heading>
      <Text textAlign="center">We coudn't found the requested ressource</Text>
      <Link as={ReactRouterLink} to="/">
        <Button variant="secondary">Go back home</Button>
      </Link>
    </Container>
  );
}