import { FEATURE_FLAG } from "@/constants/feature_flags";
import { Box } from "@chakra-ui/react";
import { useFlag } from "@unleash/nextjs";

const Header = () => {
  const isEnabled = useFlag(FEATURE_FLAG.TEST_FEATURE);

  return (
    <Box p={4}>
      {isEnabled
        ? "You got a new test feature!"
        : "Same old boring header.. :)"}
    </Box>
  );
};

export default Header;
