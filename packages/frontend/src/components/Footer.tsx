import { Flex, Heading, Icon, Link, Text } from "@chakra-ui/react";
import { FaXTwitter, FaDiscord } from "react-icons/fa6";

export const Footer = () => {
  return (
    <Flex
      as="footer"
      flexDirection="column"
      justify="center"
      align="center"
      w="100%"
      h={{ base: "92vh", md: "90vh", xl: "50vh" }}
      gap="3em"
    >
      <Heading
        as="h2"
        fontSize={{ base: "3rem", md: "4rem" }}
        mb="2rem"
        textAlign="center"
        maxW="600px"
      >
        Know first when we finish building cored
        <Text as="span" color="brand.600">
          .in
        </Text>{" "}
        for you
      </Heading>
      <Flex direction="row" justify="space-between" w="100%" maxW="180px">
        <Link href="https://twitter.com/cored_in" isExternal fontSize="3rem">
          <Icon
            as={FaXTwitter}
            _hover={{
              color: "brand.600"
            }}
          />
        </Link>
        <Link href="https://discord.gg/wMc5uCkr" isExternal fontSize="3rem">
          <Icon
            as={FaDiscord}
            _hover={{
              color: "brand.600"
            }}
          />
        </Link>
      </Flex>
    </Flex>
  );
};
