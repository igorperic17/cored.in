import { Box, Button, Heading, VStack } from "@chakra-ui/react";

export const CallToAction = () => {
  return (
    <VStack minH="50vh">
      <Heading as="h2" fontSize="4rem" mb="1em" textAlign="center">
        Elevate your career
      </Heading>
      <Button variant="primary" size="xl">
        Sign In
      </Button>
    </VStack>
  );
};
