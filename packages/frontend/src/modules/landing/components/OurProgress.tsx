import {
  appearFromRightOneByOne,
  fadeInOneByOne
} from "@/components/constants/animations";
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
import { motion } from "framer-motion";

const steps = [
  {
    title: "Profile registration",
    description:
      "Users can create a cored.in profile and generate a Decentralized Identifier (DID) by connecting their Keplr wallet on the Coreum chain, which is then registered on-chain."
  },
  {
    title: "Subscription-based verifiable claims",
    description:
      "Profiles on cored.in are enriched with verifiable credentials, allowing users to choose between public, anonymized, or private visibility for their content. Hidden information and claim verification are only disclosed to profile subscribers, who may optionally pay for access."
  },
  {
    title: "Incentivized messaging",
    description:
      "To prevent spam, cored.in users can request upfront payment before being contacted, ensuring mutual interest in the conversation."
  },
  {
    title: "Talent hunting",
    description:
      "Find your next dream job or the best team for your project. With cored.in, you can verify the candidate and the employer's background, ensuring a fully transparent and trustworthy recruitment process."
  }
];

export const OurProgress = () => {
  const { activeStep } = useSteps({
    index: 1,
    count: steps.length
  });

  return (
    <Flex
      as="section"
      direction="column"
      w="100%"
      id="progress"
      h="min-content"
      // border="1px solid blue"
      align="center"
      justifyContent="space-between"
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
        Roadmap
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

            <Box
              flexShrink="0"
              w="600px"
              maxW="78vw"
              pl="1em"
              as={motion.div}
              variants={appearFromRightOneByOne}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0 }}
              custom={index}
            >
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator
              as={motion.div}
              variants={fadeInOneByOne}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0 }}
              custom={index}
            />
          </Step>
        ))}
      </Stepper>
    </Flex>
  );
};
