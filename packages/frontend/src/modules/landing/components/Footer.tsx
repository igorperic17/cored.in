// import { BackToTop } from "@/modules/landing/components/BackToTop";
import { SocialMedia } from "@/components";
import { fadeInAnimation } from "@/constants/animations";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <Box
      as={motion.footer}
      w="100%"
      h="min-content"
      minH="50vh"
      initial="initial"
      whileInView="animate"
      variants={fadeInAnimation}
      viewport={{ once: true, amount: 0.3 }}
      // border="1px solid red"
    >
      <Flex
        flexDirection="column"
        justify="center"
        align="center"
        gap="3em"
        pt="5em"
        pb="10em"
        px="1em"
        mt="7em"
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
      </Flex>
      <Text color="text.400" textAlign="center" p="1em">
        All rights reserved — cored.in &copy;{" "}
        <Text as="span">{new Date().getFullYear()}</Text>
      </Text>
    </Box>
  );
};
