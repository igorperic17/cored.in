import { Box, VStack } from "@chakra-ui/react";
import { Benefits, Hero } from "../components";

const LandingPage = () => {
  return (
    <Box mx="auto" maxW="1680px">
      <VStack px="2em" gap="11em" mb="16">
        <Hero />
        <Benefits />
      </VStack>
    </Box>
  );
};

export default LandingPage;
