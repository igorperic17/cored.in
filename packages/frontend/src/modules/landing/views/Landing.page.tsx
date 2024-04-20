import { Box, VStack } from "@chakra-ui/react";
import { Benefits, CallToAction, Hero } from "../components";
import { useFeatureFlagContext } from "@/contexts/featureFlag";
import { FEATURE_FLAG } from "@/constants/featureFlag";

const LandingPage = () => {
  const { isInitialised, isFeatureEnabled } = useFeatureFlagContext()
  return (
    <Box mx="auto" maxW="1680px">
      <VStack px="2em" gap="11em" mb="16">
        <Hero />
        <Benefits />
        {isInitialised && isFeatureEnabled(FEATURE_FLAG.APP) && <CallToAction />}
      </VStack>
    </Box>
  );
};

export default LandingPage;
