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
      h={{ base: "92vh", md: "90vh", xl: "89vh" }}
      mt={{ base: "0em", xl: "15em" }}
      gap="3em"
    >
      <Heading
        as="h2"
        fontSize={{ base: "3rem", md: "4rem" }}
        mb="2rem"
        textAlign="center"
        maxW="600px"
      >
        Be the first to know when we finish building cored
        <Text as="span" color="brand.600">
          .in
        </Text>{" "}
        for you
      </Heading>
      <SocialMedia />
      <BackToTop />
    </Flex>
  );
};
