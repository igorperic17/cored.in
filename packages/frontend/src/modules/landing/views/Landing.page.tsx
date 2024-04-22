import { Flex } from "@chakra-ui/react";
import { Benefits, CallToAction, Hero } from "../components";
import { useFeatureFlagContext } from "@/contexts/featureFlag";
import { FEATURE_FLAG } from "@/constants/featureFlag";

const LandingPage = () => {
  const { isInitialised, isFeatureEnabled } = useFeatureFlagContext();
  return (
    <Flex flexDirection="column" mx="auto" maxW="1920px" px={{ base: "1.5em", md: "2em" }} pb="5em" gap="7em">
      <Hero />
      <Benefits />
      {isInitialised && isFeatureEnabled(FEATURE_FLAG.APP) && (
        <CallToAction />
      )}
    </Flex>
  );
};

export default LandingPage;
