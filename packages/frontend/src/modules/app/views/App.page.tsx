import { Login } from "@/components";
import { Box, Flex } from "@chakra-ui/react";
import { Profile } from "../components";
import { Logo } from "@/components/Logo";

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
        <Logo fontSize={{ base: "2rem", md: "3rem" }} />
        <Login />
        <Profile />
      </Flex>
    </Box>
  );
};

export default AppPage;
