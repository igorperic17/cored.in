import { BackToTop } from "@/modules/landing/components/BackToTop";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { SocialMedia } from "./SocialMedia";

export const Footer = () => {
  return (
    <Flex
      as="footer"
      flexDirection="column"
      justify="center"
      align="center"
      w="100%"
      h="min-content"
      gap="3em"
      // border="1px solid red"
      pt="5em"
      pb="10em"
    >
      <Heading
        as="h2"
        fontSize={{ base: "3rem", md: "4rem" }}
        mb="2rem"
        textAlign="center"
        maxW="600px"
      >
        Get notified when cored
        <Text as="span" color="brand.600">
          .in
        </Text>{" "}
        is ready
      </Heading>
      <SocialMedia />
    </Flex>
  );
};
