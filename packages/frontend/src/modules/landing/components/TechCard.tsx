import { fadeInOneByOne } from "@/components/constants/animations";
import { Heading, VStack, Text, Img } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FC } from "react";

interface TechProps {
  heading: string;
  text: string;
  index: number;
  image?: string;
}

export const TechCard: FC<TechProps> = ({ heading, text, index, image }) => {
  return (
    <VStack
      as={motion.div}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInOneByOne}
      custom={index}
      spacing="2em"
      align="start"
      borderRadius="16px"
      //   border="1px solid white"
      color="text.100"
      background="background.600"
      px={{ base: "1em", md: "2em" }}
      pt={{ base: "1.25em", md: "2.5em" }}
      pb={{ base: "2em", md: "4em" }}
    >
      <Heading as="h3" fontSize={{ base: "1.5rem", md: "2.5rem", xl: "3rem" }}>
        {heading}
      </Heading>
      <Text whiteSpace="pre-line">{text}</Text>
      <Img
        src={image}
        aria-hidden="true"
        border="1px solid red"
        w="100%"
        maxW="80%"
        h="auto"
      />
    </VStack>
  );
};
