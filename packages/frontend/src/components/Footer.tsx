// import { BackToTop } from "@/modules/landing/components/BackToTop";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { SocialMedia } from "./SocialMedia";
import { motion } from "framer-motion";
import { useRef } from "react";

const footerVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 2
    }
  }
};

export const Footer = () => {
  const container = useRef(null);
  const ref = useRef(null);

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
      variants={footerVariants}
      viewport={{ once: true }}
      ref={container}
    >
      <Heading
        as="h2"
        fontSize={{ base: "3rem", md: "4rem" }}
        mb="2rem"
        textAlign="center"
        maxW="600px"
        ref={ref}
      >
        Get notified when cored
        <Text as="span" color="brand.500">
          .in
        </Text>{" "}
        is ready
      </Heading>
      <SocialMedia />
    </Flex>
  );
};
