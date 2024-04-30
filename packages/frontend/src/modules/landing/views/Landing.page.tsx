import { Flex } from "@chakra-ui/react";
import { Benefits, CallToAction, Hero, Tech } from "../components";
import { useFeatureFlagContext } from "@/contexts/featureFlag";
import { FEATURE_FLAG } from "@coredin/shared";
import { Footer } from "@/components";

const LandingPage = () => {
  const { isInitialised, isFeatureEnabled } = useFeatureFlagContext();
  return (
    <Flex
      flexDirection="column"
      mx="auto"
      maxW="1920px"
      px={{ base: "1.5em", md: "2.5em", lg: "3.5em", xl: "4em" }}
      gap="7em"
    >
      <Hero />
      <Benefits />
      <Tech />
      {isInitialised && isFeatureEnabled(FEATURE_FLAG.APP) && <CallToAction />}
      <Footer />
    </Flex>
  );
};

export default LandingPage;
