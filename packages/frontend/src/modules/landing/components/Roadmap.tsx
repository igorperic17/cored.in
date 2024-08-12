import {
  appearFromRightOneByOne,
  fadeInOneByOne
} from "@/constants/animations";
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
import { NAV_SECTIONS, ROADMAP_STEPS } from "../constants";

export const Roadmap = () => {
  const { activeStep } = useSteps({
    index: 2,
    count: ROADMAP_STEPS.length
  });

  return (
    <Flex
      as="section"
      direction="column"
      w="100%"
      id={NAV_SECTIONS.ROADMAP}
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
        {ROADMAP_STEPS.map((step, index) => (
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
