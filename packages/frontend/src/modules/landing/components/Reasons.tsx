import { Box, Heading, List } from "@chakra-ui/react";
import { BenefitItem } from "./BenefitItem";
import { useState } from "react";
import { NAV_SECTIONS } from "../constants";
import { reason, REASONS_DATA } from "../constants/reasonsData";

export const Reasons = () => {
  const [selectedBenefit, setSelectedBenefit] = useState<reason>();

  const benefitItems = REASONS_DATA.map((benefit, index) => {
    return (
      <BenefitItem
        key={`landing-benefit-${index}`}
        title={benefit.title}
        description={benefit.description}
        isVisible={selectedBenefit === benefit.title}
        onClick={() =>
          setSelectedBenefit(
            benefit.title === selectedBenefit ? undefined : benefit.title
          )
        }
        index={index}
      />
    );
  });

  return (
    <Box
      as="section"
      w="100%"
      id={NAV_SECTIONS.WHY_COREDIN}
      h="min-content"
      minH={{ base: "92vh", md: "91vh" }} // NOTE: Do not modify this only as the nav bar and other page sections also rely on vh to ensure content does not overlap.
      pt={{ base: "8vh", md: "9vh" }} // NOTE: Do not modify this only as the nav bar and other page sections also rely on vh to ensure content does not overlap.
      overflowX="hidden"
    >
      <Heading
        as="h2"
        fontSize={{ base: "3rem", md: "4.5rem", xl: "5rem" }}
        color="brand.500"
        mb={{ base: "0.375em", md: "0.5em", xl: "0.375em" }}
      >
        Why cored.in?
      </Heading>
      <List spacing={{ base: "1.5em", md: "2.25em" }}>{benefitItems}</List>
    </Box>
  );
};
