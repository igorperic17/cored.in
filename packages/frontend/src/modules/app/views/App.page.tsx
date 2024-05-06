import { Login } from "@/components";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { Profile } from "./components";

const AppPage = () => {
  return (
    <Box mx="auto" maxW="1680px">
      <Flex
        direction="column"
        justify="center"
        align="center"
        h={{ base: "92vh", xl: "88vh" }}
        px="2em"
        gap="5em"
        mb="16"
      >
        <Heading as="h1" fontSize={{ base: "2rem", md: "3rem" }}>
          cored
          <Text as="span" color="brand.500">
            .in
          </Text>
        </Heading>
        <Login />
        <Profile />
      </Flex>
    </Box>
  );
};

export default AppPage;
