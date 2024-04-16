import { Box, Heading, List, VisuallyHidden } from "@chakra-ui/react";
import { BenefitItem } from "./BenefitItem";
import { useState } from "react";

const benefitsData = [
  {
    title: "Create trustable profile",
    description:
      "Gain credibility through verification of your diplomas and work experience by professional institutions, past, and present employers."
  },
  {
    title: "Protect your data",
    description: "Manage who has permission to view your complete profile."
  },
  {
    title: "Chat securely",
    description: "Securely message other users with encrypted messages."
  },
  {
    title: "Get paid",
    description:
      "Get paid for sharing the information in your profile with other users and receiving messages."
  },
  {
    title: "No spam",
    description:
      "Since sending messages incurs a cost, it is less attractive for spammers. If you ever receive messages from them, you will be paid for it."
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
        onClick={() =>
          setSelectedBenefit(
            benefit.title === selectedBenefit ? undefined : benefit.title
          )
        }
      />
    );
  });

  return (
    <Box w="100%" minH="100vh">
      <Heading as="h2" fontSize="4rem" color="brand.600" mb="1em">
        Individual Benefits
      </Heading>
      <List spacing="3em" mb="8em">
        {benefitEls}
      </List>
    </Box>
  );
};
