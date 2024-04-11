import { Box, VStack } from "@chakra-ui/react";
import { Benefits, Hero } from "../components";

const LandingPage = () => {
  return (
    <Box mx="auto" maxW="1680px">
      {/* <VStack gap="11em" mb="16" px="2em"> */}
      <VStack px="2em">
        <Hero />
        <Benefits />
      </VStack>
    </Box>
  );
};

export default LandingPage;
