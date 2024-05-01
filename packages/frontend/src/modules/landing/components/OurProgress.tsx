import {
  Box,
  Flex,
  Heading,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps
} from "@chakra-ui/react";

const steps = [
  {
    title: "Profile registration",
    description:
      "By connecting their Coreum wallet, users can create a cored.in profile, generate a DID and register it on-chain."
  },
  {
    title: "Subscription-based verifiable claims",
    description:
      "Profiles are enriched with verifiable credentials, whose content can have a public, anonymized or private visibility. Hidden information and claim verification will only be disclosed to profile subscribers (optionally paid)."
  },
  {
    title: "Incentivized messaging",
    description:
      "To avoid spam, cored.in users can require upfront payment in order to be contacted, thus ensuring the mutual interest of the conversation."
  },
  {
    title: "Talent hunting",
    description:
      "Find your next dream job or the best team for your project. With cored.in, you can verify the cantidate and the employers background, ensuring a fully transparent and trustless recruitment processs"
  }
];

export const OurProgress = () => {
  const { activeStep } = useSteps({
    index: 1,
    count: steps.length
  });

  return (
    <Flex
      direction="column"
      gap="5em"
      w="100%"
      id="progress"
      minH="80vh"
      h="min-content"
      // border="1px solid blue"
      align="center"
      pt={{ base: "8vh", md: "9vh" }} // NOTE: Do not modify this only as the nav bar and other page sections also rely on vh to ensure content does not overlap.
      //
    >
      <Heading
        as="h2"
        fontSize={{ base: "3rem", md: "4.5rem", xl: "5rem" }}
        color="brand.500"
        mb={{ base: "0.75em", md: "0.5em", xl: "0.375em" }}
      >
        Follow our progress
      </Heading>
      <Stepper
        index={activeStep}
        colorScheme="brand"
        orientation="vertical"
        minH="600px"
        gap="0"

        // border="1px solid red"
      >
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0" w="600px" maxW="78vw" pl="1em">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </Flex>
  );
};
