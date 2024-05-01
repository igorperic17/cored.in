import { Heading, VStack, Text } from "@chakra-ui/react";
import { FC } from "react";

interface TechProps {
  heading: string;
  text: string;
  image?: string;
}

export const TechCard: FC<TechProps> = ({ heading, text, image }) => {
  return (
    <VStack
      spacing="2em"
      align="start"
      //   width="100%"
      //   minW="300px"
      maxW="400px"
      minH={{ base: "48vh", md: "55vh" }}
      h="100%"
      borderRadius="16px"
      //   border="1px solid white"
      color="text.100"
      background="background.600"
      _hover={{
        boxShadow: "0 0 5px 0 #7AF9B3"
      }}
      px={{ base: "1em", md: "2em" }}
      py={{ base: "1.25em", md: "2.5em" }}
    >
      <Heading as="h3" fontSize={{ base: "1.5rem", md: "2.5rem", xl: "3rem" }}>
        {heading}
      </Heading>
      <Text whiteSpace="pre-line">{text}</Text>
    </VStack>
  );
};
