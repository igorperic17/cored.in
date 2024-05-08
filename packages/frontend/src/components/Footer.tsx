// import { BackToTop } from "@/modules/landing/components/BackToTop";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { SocialMedia } from "./SocialMedia";
import { motion } from "framer-motion";
import { fadeInAnimation } from "./constants/animations";

export const Footer = () => {
  return (
    <Flex
      as={motion.footer}
      flexDirection="column"
      justify="center"
      align="center"
      w="100%"
      h="min-content"
      minH="50vh"
      gap="3em"
      // border="1px solid red"
      pt="5em"
      pb="10em"
      mt="7em"
      initial="initial"
      whileInView="animate"
      variants={fadeInAnimation}
      viewport={{ once: true, amount: 0.3 }}
    >
      <Heading
        as="h2"
        fontSize={{ base: "3rem", md: "4rem" }}
        mb="2rem"
        textAlign="center"
        maxW="600px"
      >
        Get notified when cored
        <Text as="span" color="brand.500">
          .in
        </Text>{" "}
        is ready
      </Heading>
      <SocialMedia />
      <Text>
        {`All rights reserved - cored.in - ${new Date().getFullYear()}`}
      </Text>
    </Flex>
  );
};
