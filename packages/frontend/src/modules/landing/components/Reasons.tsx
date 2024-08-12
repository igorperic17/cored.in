import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { NAV_SECTIONS } from "../constants";
import { REASONS_DATA } from "../constants/reasonsData";
import { ReasonCard } from "./ReasonCard";

export const Reasons = () => {
  return (
    <VStack
      as="section"
      w="100%"
      id={NAV_SECTIONS.WHY_COREDIN}
      // h="min-content"
      minH={{ base: "92vh", md: "89vh" }} // NOTE: Do not modify this only as the nav bar and other page sections also rely on vh to ensure content does not overlap.
      pt={{ base: "8vh", md: "9vh" }} // NOTE: Do not modify this only as the nav bar and other page sections also rely on vh to ensure content does not overlap.
      spacing="3.125em"
      border="1px solid red"
    >
      <Box textAlign="center">
        <Heading
          as="h2"
          // fontSize={{ base: "3rem", md: "4.5rem", xl: "5rem" }}
          fontSize="2.25rem"
          fontWeight="400"
          lineHeight="1.25"
          color="brand.200"
        >
          Why cored.in?
        </Heading>
        <Text
          fontSize="4.5rem"
          fontWeight="700"
          lineHeight="1.25"
          color="brand.100"
        >
          Your success toolkit
        </Text>
      </Box>
      <Flex
        as="ul"
        w="100%"
        maxW="1220px"
        justify="center"
        flexWrap="wrap"
        gap="3.75em"
      >
        {REASONS_DATA.map((benefit, index) => {
          return (
            <ReasonCard
              key={`landing-reason-${index}`}
              title={benefit.title}
              description={benefit.description}
              index={index}
            />
          );
        })}
      </Flex>
    </VStack>
  );
};
