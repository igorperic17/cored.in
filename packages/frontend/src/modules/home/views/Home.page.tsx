import { Box } from "@chakra-ui/react";
import { Profile } from "../components";

const HomePage = () => {
  return (
    <Box
      mx="auto"
      w="100%"
      maxW="1920px"
      px={{ base: "1.5em", md: "2.5em", lg: "3.5em", xl: "4em" }}
    >
      <Profile />
    </Box>
  );
};

export default HomePage;
