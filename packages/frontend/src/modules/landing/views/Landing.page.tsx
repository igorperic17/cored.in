import { Flex } from "@chakra-ui/react";
import { Benefits, Hero, OurProgress, Tech } from "../components";
import { useFeatureFlagContext } from "@/contexts/featureFlag";

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
      <OurProgress />
    </Flex>
  );
};

export default LandingPage;
