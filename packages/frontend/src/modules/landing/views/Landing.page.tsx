import { Flex } from "@chakra-ui/react";
import { Hero, OurProgress, Reasons, Tech } from "../components";

const LandingPage = () => {
  return (
    <Flex
      flexDirection="column"
      mx="auto"
      maxW="1920px"
      px={{ base: "1.5em", md: "2.5em", lg: "3.5em", xl: "4em" }}
      gap="7em"
    >
      <Hero />
      <Reasons />
      <Tech />
      <OurProgress />
    </Flex>
  );
};

export default LandingPage;
