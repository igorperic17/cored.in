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
    title: "First",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit pariatur itaque, alias asperiores aliquid nisi cupiditate laboriosam delectus earum! Architecto repellat odit soluta a nihil quidem rerum fuga laborum qui?"
  },
  {
    title: "Second",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit pariatur itaque, alias asperiores aliquid nisi cupiditate laboriosam delectus earum! Architecto repellat odit soluta a nihil quidem rerum fuga laborum qui?"
  },
  {
    title: "Third",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit pariatur itaque, alias asperiores aliquid nisi cupiditate laboriosam delectus earum! Architecto repellat odit soluta a nihil quidem rerum fuga laborum qui?"
  },
  {
    title: "Fourth",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit pariatur itaque, alias asperiores aliquid nisi cupiditate laboriosam delectus earum! Architecto repellat odit soluta a nihil quidem rerum fuga laborum qui?"
  }
];

export const OurProgress = () => {
  const { activeStep } = useSteps({
    index: 2,
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
