import { FeatureFlag } from "@/constants/featureFlag";
import { Box } from "@chakra-ui/react";
import { useFlag } from "@unleash/nextjs";

const Header = () => {
  const isEnabled = useFlag(FeatureFlag.TEST_FEATURE);

  return (
    <Box p={4}>
      {isEnabled
        ? "You got a new test feature!"
        : "Same old boring header.. :)"}
    </Box>
  );
};

export default Header;
