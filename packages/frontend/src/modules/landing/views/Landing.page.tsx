import { Flex } from "@chakra-ui/react";
import { Advantages, Hero, OurProgress, Reasons } from "../components";

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
      <Advantages />
      <OurProgress />
    </Flex>
  );
};

export default LandingPage;
