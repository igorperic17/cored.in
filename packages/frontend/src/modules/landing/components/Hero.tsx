import { fadeInWithDelayAnimation } from "@/constants/animations";
import { Box, Button, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { NAV_SECTIONS } from "../constants";
import { LogoIconColor } from "@/components";
import { Link as ReactRouterLink } from "react-router-dom";
import { ROUTES } from "@/router/routes";

export const Hero = () => {
  return (
    <Flex
      as="section"
      id={NAV_SECTIONS.HOME}
      w="100%"
      maxW="1620px"
      mx="auto"
      minH={{ base: "92vh", md: "89vh" }} // NOTE: Do not modify this only as the nav bar and other page sections also rely on vh to ensure content does not overlap.
      direction="column"
      align="start"
      justify="center"
      mt={{ base: "2em" }}
      pb={{ base: "1em", md: "2.5em" }} // TODO
      color="brand.100"
      // border="1px solid red"
      position="relative"
    >
      <Flex
        direction="column"
        gap="1.5em"
        // border="1px solid yellow"
        //
      >
        <Heading
          as="h1"
          fontSize={{ base: "3rem", md: "4.5rem", xl: "5.25rem" }}
          textAlign="left"
          fontWeight="700"
          // maxW={{ base: "750px", xl: "900px" }}
        >
          Your Expertise,{" "}
          <Text as="span" fontWeight="400">
            Verified.
          </Text>
          <Text as="span" display="block">
            Your Career,{" "}
            <Text as="span" fontWeight="400">
              Amplified.
            </Text>
          </Text>
        </Heading>
        <Flex direction="column" gap="1.5em">
          <Text
            fontWeight="300"
            fontSize={{ lg: "1.25rem" }}
            lineHeight="1.25"
            maxW="636px"
          >
            Connect with industry leaders, showcase your skills, and unlock
            exclusive opportunities. Your career journey, elevated and
            protected.
          </Text>
          <HStack spacing="1em">
            <Button
              variant="primary"
              as={ReactRouterLink}
              to={ROUTES.LOGIN.path}
              _hover={{ textDecoration: "none" }}
            >
              Join coredin
            </Button>
            <Text
              as="span"
              color="brand.300"
              fontWeight="300"
              fontSize="0.875rem"
              lineHeight="1.25"
            >
              Your Trusted Professional Network
            </Text>
          </HStack>
        </Flex>
      </Flex>
      <Box position="absolute" right="24px" top="7vh" zIndex="-1">
        <LogoIconColor w="764px" h="783px" />
      </Box>
      <Box
        layerStyle="transparentBox"
        alignSelf="center"
        maxW="810px"
        py="1.5em"
        px="1em"
        position="absolute"
        bottom="48px"
      >
        <Text fontWeight="300" fontSize={{ lg: "1rem" }} lineHeight="1.25">
          Elevate your career with a verified digital identity. Control your
          data, customize your visibility, and connect confidently in a curated,
          spam-free environment. Showcase your expertise and unlock authentic
          opportunities on a platform built on trust.
        </Text>
      </Box>
    </Flex>
  );
};
