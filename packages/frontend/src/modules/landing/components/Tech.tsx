import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import { TechCard } from "./TechCard";

const techData = [
  {
    heading: "Built on Coreum",
    text: "Built on top of the Cosmos ecosystem, Coreum is a Smart-Contract proof-of-stake blockchain built as a core infrastructure for the future of decentralized applications and Defi.\n\nCoreum is actively supporting cored.in as part of the Wave 3 of their development grants."
  },
  {
    heading: "Soulbound subscriptions",
    text: "Profile subscriptions are represented by soulbound non-fungible tokens that are minted on demand.\n\nUsers can optionally set a price for their subscriptions that will be automatically paid by the subscriber upon minting."
  },
  {
    heading: "Verifiable credentials",
    text: "By leveraging the open-source SSI (Self-Sovereign Identity) technology from walt.id, each profile is backed by a DID (Decentralized Identifier).\n\nClaims are then based on verifiable credentials which include cryptographic proof of the information issuer to ensure their autenticity. They can be either issued directly within the platform or imported from existing SSI standards."
  }
];

export const Tech = () => {
  return (
    <Box
      // border="1px solid red"
      w="100%"
      id="tech"
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
        Our Tech
      </Heading>
      <SimpleGrid spacing="2em" minChildWidth="320px">
        {techData.map((tech, index) => (
          <TechCard
            key={index}
            heading={tech.heading}
            text={tech.text}
            index={index}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};
