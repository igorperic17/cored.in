import { Box, Flex } from "@chakra-ui/react";
import { Benefits, CallToAction, Hero } from "../components";
import { useFeatureFlagContext } from "@/contexts/featureFlag";
import { FEATURE_FLAG } from "@/constants/featureFlag";

const LandingPage = () => {
  const { isInitialised, isFeatureEnabled } = useFeatureFlagContext();
  return (
    <Box mx="auto" maxW="1920px">
      <Hero />
      <Flex h="90vh" flexDirection="column" justify="space-between">
        <Benefits />
        {isInitialised && isFeatureEnabled(FEATURE_FLAG.APP) && (
          <CallToAction />
        )}
      </Flex>
    </Box>
  );
};

export default LandingPage;
