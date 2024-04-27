import { Button, Flex } from "@chakra-ui/react";

export const BackToTop = () => {
  const backToTopHandler = () => document.getElementById('hero')!.scrollIntoView({ behavior: 'smooth' })
  return (
    <Flex
      flexDirection="column"
      justify="center"
      align="center"
      pb={{ base: "0em", xl: "5em" }}
    >
      <Button variant="primary" size="md" onClick={backToTopHandler}>
        Back to top
      </Button>
    </Flex>
  );
};
