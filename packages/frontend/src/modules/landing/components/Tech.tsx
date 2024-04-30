import { Box, Flex, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { TechCard } from "./TechCard";

export const Tech = () => {
  return (
    <Box
      // border="1px solid red"
      w="100%"
      id="tech"
      minH="80vh"
      h="min-content"
      //
    >
      <Heading
        as="h2"
        fontSize={{ base: "3rem", md: "4.5rem", xl: "5rem" }}
        color="brand.600"
        mb={{ base: "0.75em", md: "0.5em", xl: "0.375em" }}
      >
        Our Tech
      </Heading>
      <SimpleGrid
        h="100%"
        spacing="2em"
        columns={[1, null, null, 4]}
        // border="1px solid blue"
        minChildWidth="350px"
      >
        <TechCard
          heading="1 Heading here"
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur,
        nobis nisi delectus iure dicta, est quas maxime, cupiditate iusto unde
        excepturi magni architecto asperiores corporis commodi numquam
        blanditiis enim? Soluta."
        />
        <TechCard
          heading="2 Heading here"
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur,
        nobis nisi delectus iure dicta, est quas maxime, cupiditate iusto unde
        excepturi magni architecto asperiores corporis commodi numquam
        blanditiis enim? Soluta."
        />
        <TechCard
          heading="3 Heading here"
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur,
        nobis nisi delectus iure dicta, est quas maxime, cupiditate iusto unde
        excepturi magni architecto asperiores corporis commodi numquam
        blanditiis enim? Soluta."
        />
        <TechCard
          heading="4 Heading here"
          text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur,
        nobis nisi delectus iure dicta, est quas maxime, cupiditate iusto unde
        excepturi magni architecto asperiores corporis commodi numquam
        blanditiis enim? Soluta."
        />
      </SimpleGrid>
    </Box>
  );
};
