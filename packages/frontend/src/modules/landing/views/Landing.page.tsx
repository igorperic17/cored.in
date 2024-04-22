import { Flex } from "@chakra-ui/react";
import { Benefits, CallToAction, Hero } from "../components";
import { useFeatureFlagContext } from "@/contexts/featureFlag";
import { FEATURE_FLAG } from "@/constants/featureFlag";
import { BackToTop } from "../components/BackToTop";

const LandingPage = () => {
  const { isInitialised, isFeatureEnabled } = useFeatureFlagContext();
  return (
    <Flex flexDirection="column" mx="auto" maxW="1920px" px={{ base: "1.5em", md: "2.5em", lg: "3.5em", xl: "4em" }} pb="5em" gap="7em">
      <Hero />
      <Benefits />
      {isInitialised && isFeatureEnabled(FEATURE_FLAG.APP) && (
        <CallToAction />
      )}
      {isInitialised && !isFeatureEnabled(FEATURE_FLAG.APP) && (
        <BackToTop />
      )}
    </Flex>
  );
};

export default LandingPage;
