import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export const Hero = () => {
  return (
    <Box w="100%" mt="6vh">
      <Flex
        minH="80vh"
        w="100%"
        direction="column"
        align="start"
        justify="center"
        gap="3em"
      >
        <Heading
          as="h2"
          fontSize={{ base: "3rem", md: "5rem", xl: "7rem" }}
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
    </Box>
  );
};
