import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import { ADVANTAGES_DATA, NAV_SECTIONS } from "../constants";
import { AdvantageCard } from ".";

export const Advantages = () => {
  return (
    <Box
      // border="1px solid red"
      as="section"
      w="100%"
      id={NAV_SECTIONS.ADVANTAGES}
      h="min-content"
      minH={{ base: "92vh", md: "91vh" }} // NOTE: Do not modify this only as the nav bar and other page sections also rely on vh to ensure content does not overlap.
      pt={{ base: "8vh", md: "9vh" }} // NOTE: Do not modify this only as the nav bar and other page sections also rely on vh to ensure content does not overlap.
      //
    >
      <Heading
        as="h2"
        fontSize={{ base: "3rem", md: "4.5rem", xl: "5rem" }}
        color="brand.500"
        mb={{ base: "0.75em", md: "0.5em", xl: "0.375em" }}
      >
        Advantages
      </Heading>
      <SimpleGrid spacing="2em" minChildWidth="320px">
        {ADVANTAGES_DATA.map((advantage, index) => (
          <AdvantageCard
            key={index}
            heading={advantage.heading}
            text={advantage.text}
            image={advantage.image}
            alt={advantage.alt}
            index={index}
            link={advantage.link}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};
