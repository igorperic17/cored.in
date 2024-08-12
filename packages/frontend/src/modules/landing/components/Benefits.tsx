import { Box, Heading, List } from "@chakra-ui/react";
import { BenefitItem } from "./BenefitItem";
import { useState } from "react";

const benefitsData = [
  {
    title: "Create a verifiable profile",
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

  const benefitItems = benefitsData.map((benefit, index) => {
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
      id="why-coredin"
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
        Benefits
      </Heading>
      <List spacing={{ base: "1.5em", md: "2.25em" }}>{benefitItems}</List>
    </Box>
  );
};
