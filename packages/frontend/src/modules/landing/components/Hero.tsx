import { Flex, Heading, Text } from "@chakra-ui/react";

export const Hero = () => {
  return (
    <Flex
      w="100%"
      h="90vh"
      pt="6vh"
      pb="6vh"
      direction="column"
      align="start"
      justify="space-between"
    >
      <Heading
        as="h2"
        fontSize={{ base: "3rem", md: "4rem", xl: "5rem" }}
        textAlign="left"
        maxW={{ base: "750px", xl: "900px" }}
      >
        Professional network with verified user information only
      </Heading>
      <Text
        textAlign="right"
        maxW={{ base: "300px", sm: "420px", xl: "650px" }}
        alignSelf="end"
        fontSize={{ base: "1rem", md: "1.5rem", xl: "2rem" }}
      >
        Empower your professional experience with CoredIn. Customize your
        profile visibility and choose who can reach out to you. It's time to
        connect with confidence and unlock new opportunities.
      </Text>
    </Flex>
  );
};
