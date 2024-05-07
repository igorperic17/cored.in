import { Login } from "@/components";
import { Logo } from "@/components/Logo";
import { Flex } from "@chakra-ui/react";

export const Header = () => {
  return (
    <Flex
      as="header"
      direction="row"
      justify="space-between"
      align="center"
      // border="1px solid red"
      w="100%"
      maxW="1920px"
      mx="auto"
      px={{ base: "1em", md: "2.5em", lg: "3.5em", xl: "4em" }}
      py={{ base: "0.5em", md: "0.25em" }}
      background="background.900"
    >
      <Logo fontSize={{ base: "1.5rem", md: "2rem" }} />
      <Login variant="empty" signInText="Connect wallet" />
    </Flex>
  );
};
