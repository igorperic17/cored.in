import { Box, Heading, List, VisuallyHidden } from "@chakra-ui/react";
import { BenefitItem } from "./BenefitItem";
import { useState } from "react";

const benefitsData = [
  {
    title: "Create trustable profile",
    description:
      "Gain credibility through verification of your diplomas and work experience by professional institutions, past, and present employers. Our platform ensures all user information is backed by verifiable credentials, following the latest standards on Self-Sovereign identity. We leverage a custom WebAssembly (WASM) contract to establish an on-chain Decentralized Identifier (DID) registry, enabling users to control data sharing securely."
  },
  {
    title: "Protect your data",
    description:
      "Manage who has permission to view your complete profile. Users can subscribe to each other's profiles using a soul-bound smart NFT, which is minted by paying a small fee to the profile owner. Only generic and anonymous data are stored on-chain."
  },
  {
    title: "Network securely",
    description:
      "Securely message the profile owner directly within CoredIn with encrypted on-chain messages."
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
