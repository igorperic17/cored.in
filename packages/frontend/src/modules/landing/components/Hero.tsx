import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export const Hero = () => {
  return (
    <Box w="100%" mt="6vh" h="min-content">
      <Flex
        w="100%"
        direction="column"
        align="start"
        justify="center"
        gap="3em"
      >
        <Heading as="h2" fontSize="5rem" textAlign="left" maxW="750px">
          Professional network with verified user information only
        </Heading>
        <Text
          textAlign="right"
          maxW="350px"
          //   border="1px solid red"
          alignSelf="end"
        >
          Connect to professionals without a doubt in their experience. Share
          your complete profile and receive messages only from the users to whom
          you give permission.
        </Text>
      </Flex>
    </Box>
  );
};
