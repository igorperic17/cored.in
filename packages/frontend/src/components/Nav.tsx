import { FC, useState } from "react";
import {
  Text,
  Flex,
  useColorMode,
  useColorModeValue,
  useMediaQuery,
  Box,
  Heading,
  Button,
  Link
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useLocation } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import { useFeatureFlagContext } from "@/contexts/featureFlag";
import { FEATURE_FLAG } from "@/constants/featureFlag";

export interface NavProps {
  onOpen: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Nav: FC<NavProps> = ({ onOpen }) => {
  const { isInitialised, isFeatureEnabled } = useFeatureFlagContext();
  const location = useLocation();
  const [scroll, setScroll] = useState(false);
  const [currentSection, setCurrentSection] = useState<"home" | "insure">(
    "home"
  );
  const { colorMode, toggleColorMode } = useColorMode();
  const navBg = useColorModeValue("white", "coredin.700");
  // const [isLargerThanMD] = useMediaQuery("(min-width: 48em)");
  const [isLargerThanLG] = useMediaQuery("(min-width: 62em)");
  const changeScroll = () => {
    document.body.scrollTop > 80 || document.documentElement.scrollTop > 80
      ? setScroll(true)
      : setScroll(false);

    const element = document.querySelector(`#insure`);
    if (element) {
      const { top } = element.getBoundingClientRect();

      if (currentSection === "home" && top <= 10) {
        setCurrentSection("insure");
      } else if (currentSection === "insure" && top > 10) {
        setCurrentSection("home");
      }
    }
  };

  window.addEventListener("scroll", changeScroll);

  return (
    <Box
      as="header"
      h="15vh"
      // border="1px solid lightgrey"
      w="100%"
      maxW="1920px"
      margin="0 auto"
      px={{ base: "1.5em", md: "2.5em", lg: "3.5em", xl: "4em" }}
      py="2em"
    >
      <Flex
        direction="row"
        justify="space-between"
        align="center"
      // position="sticky"
      // zIndex="sticky"
      >
        <Heading as="h1" fontSize={{ base: "2rem", md: "3rem" }}>
          Cored.
          <Text display="inline" color="brand.600">
            in
          </Text>
        </Heading>
        {isInitialised && isFeatureEnabled(FEATURE_FLAG.APP) && (
          <Link as={ReactRouterLink} to={ROUTES.APP.path}>
            <Button variant="primary" size="md">
              Sign In
            </Button>
          </Link>
        )}
        {isInitialised && !isFeatureEnabled(FEATURE_FLAG.APP) && (
          <Button variant="primary" size="md">
            Learn more
          </Button>
        )}
      </Flex>
    </Box>
  );
};
