import { fadeInWithDelayAnimation } from "@/components/constants/animations";
import { Flex, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <Flex
      as="section"
      id="home"
      w="100%"
      h={{ base: "92vh", md: "91vh" }} // NOTE: Do not modify this only as the nav bar and other page sections also rely on vh to ensure content does not overlap.
      direction="column"
      align="start"
      justify="space-between"
      pt={{ base: "2em" }}
      pb={{ base: "1em", md: "2.5em" }}
      color="text.100"
    >
      <Heading
        as="h1"
        fontSize={{ base: "3rem", md: "4.5rem", xl: "5rem" }}
        textAlign="left"
        maxW={{ base: "750px", xl: "900px" }}
      >
        Professional network with verified user information only
      </Heading>
      <Text
        as={motion.p}
        textAlign="right"
        maxW={{ base: "300px", sm: "600px", xl: "680px" }}
        alignSelf="end"
        fontSize={{ base: "1rem", md: "1.5rem", xl: "1.75rem" }}
        variants={fadeInWithDelayAnimation}
        initial="initial"
        animate="animate"
        viewport={{ once: true }}
      >
        Empower your professional experience. Customize your profile visibility
        and choose who can reach out to you. It's time to connect with
        confidence and unlock new opportunities.
      </Text>
    </Flex>
  );
};
