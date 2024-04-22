import { Button, Flex, Heading } from "@chakra-ui/react";

export const BackToTop = () => {
  const backToTopHandler = () => document.getElementById('hero')!.scrollIntoView({ behavior: 'smooth' })
  return (
    <Flex flexDirection="column" justify="center" align="center">
      <Heading as="h2" fontSize={{ base: "3rem", md: "4rem" }} mb="3.5rem" textAlign="center">
        Coming soon!
      </Heading>
      <Button variant="primary" size="md" onClick={backToTopHandler}>
        Back to top
      </Button>
    </Flex>
  );
};
