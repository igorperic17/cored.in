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
      <Box h="100px" w="auto" position="absolute" top="1vh" left="810px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="100px" w="auto" position="absolute" top="2vh" right="250px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="80px" w="auto" position="absolute" top="20vh" left="520px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="150px" w="auto" position="absolute" top="39vh" left="110px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="80px" w="auto" position="absolute" top="37vh" right="630px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="130px" w="auto" position="absolute" top="46vh" left="750px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="200px" w="auto" position="absolute" top="46vh" right="200px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="80px" w="auto" position="absolute" top="62vh" left="550px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="100px" w="auto" position="absolute" top="85vh" left="360px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="100px" w="auto" position="absolute" top="77vh" right="760px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
      <Box h="100px" w="auto" position="absolute" top="84vh" right="410px">
        <LogoIconColor w="100%" h="100%" />
      </Box>
    </Box>
  );
};
