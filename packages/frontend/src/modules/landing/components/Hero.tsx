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
        <Heading as="h2" fontSize="5rem" textAlign="left" maxW="750px">
          Professional network with verified user information only
        </Heading>
        <Text textAlign="right" maxW="400px" alignSelf="end">
          Empower your professional experience with CoredIn. Customize your
          profile visibility and choose who can reach out to you. It's time to
          connect with confidence and unlock new opportunities.
        </Text>
      </Flex>
    </Box>
  );
};
