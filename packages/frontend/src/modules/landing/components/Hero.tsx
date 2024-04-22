import { Flex, Heading, Text } from "@chakra-ui/react";

export const Hero = () => {
  return (
    <Flex
      id="hero"
      w="100%"
      h={{ base: "92vh", md: "90vh", xl: "89vh" }}
      direction="column"
      align="start"
      justify="space-between"
      pt={{ base: "2em" }}
      pb={{ base: "1em", md: "2.5em" }}
    >
      <Heading
        as="h2"
        fontSize={{ base: "3rem", md: "4.5rem", xl: "5rem" }}
        textAlign="left"
        maxW={{ base: "750px", xl: "900px" }}
      >
        Professional network with verified user information only
      </Heading>
      <Text
        textAlign="right"
        maxW={{ base: "300px", sm: "600px", xl: "680px" }}
        alignSelf="end"
        fontSize={{ base: "1rem", md: "1.5rem", xl: "1.75rem" }}
      >
        Empower your professional experience with CoredIn. Customize your
        profile visibility and choose who can reach out to you. It's time to
        connect with confidence and unlock new opportunities.
      </Text>
    </Flex>
  );
};
