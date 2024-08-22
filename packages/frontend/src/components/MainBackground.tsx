import { Box } from "@chakra-ui/react";
import { LogoIconColor } from ".";

export const MainBackground = () => {
  return (
    <Box
      w="100%"
      maxW="1920px"
      h="100vh"
      filter="blur(20px) saturate(0%) opacity(35%)"
      //   border="5px solid red"
      position="fixed"
      top="0"
      left="50%"
      transform="translateX(-50%)"
      zIndex="-100"
    >
      <Box h="100px" w="auto" position="absolute" top="10px" left="810px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="100px" w="auto" position="absolute" top="20px" right="250px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="80px" w="auto" position="absolute" top="200px" left="520px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="150px" w="auto" position="absolute" top="390px" left="110px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="80px" w="auto" position="absolute" top="360px" right="630px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="130px" w="auto" position="absolute" top="450px" left="750px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="200px" w="auto" position="absolute" top="430px" right="200px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="80px" w="auto" position="absolute" top="610px" left="550px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="100px" w="auto" position="absolute" top="820px" left="360px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="100px" w="auto" position="absolute" top="750px" right="760px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="100px" w="auto" position="absolute" top="810px" right="410px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
    </Box>
  );
};
