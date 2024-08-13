import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FC } from "react";
import { fadeInOneByOne } from "../constants";

interface ReasonCardProps {
  title: string;
  description: string;
  index: number;
}

export const ReasonCard: FC<ReasonCardProps> = ({
  title,
  description,
  index
}) => {
  return (
    <Box
      as={motion.li}
      variants={fadeInOneByOne}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0 }}
      custom={index}
      w="570px"
    >
      <VStack
        as="article"
        layerStyle="transparentBox"
        p={{ base: "2em", md: "3.75em" }}
        border="1px solid #292929"
        textAlign="center"
      >
        <Heading
          as="h3"
          fontSize={{ base: "1.5rem", md: "2rem" }}
          lineHeight="1.25"
          color="brand.300"
        >
          {title}
        </Heading>
        <Text
          color="brand.100"
          fontWeight="300"
          fontSize={{ base: "1rem", md: "1.25rem" }}
          lineHeight="1.25"
        >
          {description}
        </Text>
      </VStack>
    </Box>
  );
};
