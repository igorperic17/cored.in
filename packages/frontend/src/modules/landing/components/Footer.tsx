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
      color="brand.100"
      // border="1px solid red"
    >
      <Flex
        flexDirection="column"
        justify="center"
        align="center"
        gap="5em"
        pt="5em"
        mb="7.5em"
        px="1em"
        mt="7em"
      >
        <Heading
          as="h2"
          fontSize={{ base: "3rem", md: "4rem" }}
          textAlign="center"
          maxW="600px"
        >
          Get notified when coredin is ready
        </Heading>
        <SocialMedia size="3rem" gap="3.5em" />
      </Flex>
      <Text color="brand.100" textAlign="center" p="1.5em">
        All rights reserved — cored.in &copy;{" "}
        <Text as="span">{new Date().getFullYear()}</Text>
      </Text>
    </Box>
  );
};
