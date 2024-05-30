import { fadeInOneByOne } from "@/constants/animations";
import { Heading, VStack, Text, Link, Box, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FC } from "react";

interface TechProps {
  heading: string;
  text: string;
  index: number;
  image?: string;
  alt?: string;
  link?: string;
}

export const TechCard: FC<TechProps> = ({
  heading,
  text,
  index,
  image,
  alt,
  link
}) => {
  return (
    <Box
      as={motion.div}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInOneByOne}
      custom={index}
      borderRadius="16px"
      color="text.100"
      background="background.600"
      px={{ base: "1em", md: "2em" }}
      pt={{ base: "1.25em", md: "2.5em" }}
      pb={{ base: "2em", md: "3.5em" }}
    >
      <VStack
        spacing="2em"
        align="start"
        h="100%"
        //   border="1px solid white"
        filter="grayscale(100%)"
        _hover={{
          filter: "none !important"
        }}
      >
        <Heading
          as="h3"
          fontSize={{ base: "1.5rem", md: "2.5rem", xl: "3rem" }}
        >
          {heading}
        </Heading>
        <Text whiteSpace="pre-line" mb="2em">
          {text}
        </Text>
        {link ? (
          <Link
            href={link}
            isExternal
            alignSelf="center"
            mt="auto"
            onClick={() => console.log(link)}
            aria-label={`Link to ${alt} website.`}
          >
            <Image
              src={image}
              alt=""
              // aria-hidden="true"
              // border="1px solid red"
              w="100%"
              maxW="80%"
              h="auto"
              maxH="150px"
              objectFit="contain"
            />
          </Link>
        ) : (
          <Image
            src={image}
            alt={alt}
            // border="1px solid red"
            w="100%"
            maxW="80%"
            h="auto"
            maxH="150px"
            objectFit="contain"
          />
        )}
      </VStack>
    </Box>
  );
};
