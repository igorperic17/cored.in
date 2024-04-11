import { Box, Heading, List, VisuallyHidden } from "@chakra-ui/react";
import { BenefitItem } from "./BenefitItem";
import { useState } from "react";

const benefitsData = [
  {
    title: "Main benefit",
    description: "This is why everyone chooses to use our platform"
  },
  {
    title: "Another benefit",
    description: "This is also why you'll love us, more text here"
  },
  {
    title: "And one more benefit",
    description: "Two is not enough, four might be too much"
  },
  {
    title: "Main benefit 2",
    description: "This is why everyone chooses to use our platform 2"
  },
  {
    title: "Another benefit 2",
    description: "This is also why you'll love us, more text here 2"
  },
  {
    title: "And one more benefit 2",
    description: "Two is not enough, four might be too much 2"
  }
] as const;

type benefit = (typeof benefitsData)[number]["title"];

export const Benefits = () => {
  const [selectedBenefit, setSelectedBenefit] = useState<benefit>();

  const benefitEls = benefitsData.map((benefit, index) => {
    return (
      <BenefitItem
        key={`landing-benefit-${index}`}
        title={benefit.title}
        description={benefit.description}
        isVisible={selectedBenefit === benefit.title}
        onClick={() => setSelectedBenefit(benefit.title)}
      />
    );
  });

  return (
    <Box w="100%">
      <VisuallyHidden>
        <Heading as="h2">Benefits</Heading>
      </VisuallyHidden>
      <List spacing="3em">{benefitEls}</List>
    </Box>
  );
};
