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
          This is a big heading in Hero section about the project
        </Heading>
        <Text
          textAlign="right"
          maxW="400px"
          //   border="1px solid red"
          alignSelf="end"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
          voluptates tenetur illum ipsum cupiditate a, illo repellendus rerum
          eligendi excepturi molestias laboriosam labore, non ad sequi.
          Architecto fugiat adipisci velit!
        </Text>
      </Flex>
    </Box>
  );
};
