import { FC, useState } from "react";
import {
  Text,
  Flex,
  Spacer,
  IconButton,
  useColorMode,
  useColorModeValue,
  useMediaQuery,
  Img,
  HStack,
  Link,
  Tooltip,
  Container
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FaAlignJustify } from "react-icons/fa";
import { Icon } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Logo from "@/assets/Logo.png";
import { SelectLang } from "./SelectLang";
import { Link as ReactRouterLink, useLocation } from "react-router-dom";

export interface NavProps {
  onOpen: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Nav: FC<NavProps> = ({ onOpen }) => {
  const location = useLocation();
  const [scroll, setScroll] = useState(false);
  const [currentSection, setCurrentSection] = useState<"home" | "insure">(
    "home"
  );
  const { colorMode, toggleColorMode } = useColorMode();
  const navBg = useColorModeValue("white", "coredin.700");
  // const [isLargerThanMD] = useMediaQuery("(min-width: 48em)");
  const [isLargerThanLG] = useMediaQuery("(min-width: 62em)");
  const { t } = useTranslation();
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
    <Container
      centerContent
      position="sticky"
      top="0"
      zIndex="sticky"
      // boxShadow={scroll ? "base" : "none"}
      // opacity="95%"
      bg="linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)"
      maxW="100vw"
      id="nav"
    >
      <Flex
        alignItems="center"
        p={isLargerThanLG ? "2em" : "1em"}
        w="full"
        // bg={navBg}
        maxW="1200px"
        bg="linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)"
      >
        <Link
          as={ReactRouterLink}
          to="/"
          _hover={{
            textDecoration: "none"
          }}
        >
          <HStack>
            <Img src={Logo} h="48px" alt="Coredin.world" />
            {/* <Text
              fontSize="xl"
              fontWeight="bold"
              color="headingBlack"
              translate="no"
            >
              Coredin.world
            </Text> */}
          </HStack>
        </Link>

        <Spacer />

        {isLargerThanLG && (
          <>
            <HStack gap="24px">
              <Link
                textDecoration={location.pathname === "/" ? "underline" : ""} // currentSection === "home" ? "underline" : ""
                as={ReactRouterLink}
                to="/"
                textColor="headingBlack"
                fontWeight="600"
                textUnderlineOffset="0.5em"
              >
                {t("home")}
              </Link>

              <Link
                textDecoration={
                  location.pathname === "/insure" ? "underline" : ""
                } // currentSection === "insure" ? "underline" : ""
                as={ReactRouterLink}
                textColor="headingBlack"
                to="/"
                fontWeight="600"
                textUnderlineOffset="0.5em"
              >
                {t("insure")}
              </Link>

              <Tooltip
                label={t("comingSoon")}
                aria-label="Coming soon"
                placement="bottom"
                hasArrow
                arrowSize={15}
                backgroundColor="bglight"
                color="textLight"
                boxShadow="none"
                py={1}
                px={2}
                mt={2}
                borderRadius="md"
              >
                <Text color="textExtraLight" cursor="default">
                  {t("exchange")}
                </Text>
              </Tooltip>

              <Tooltip
                label={t("comingSoon")}
                aria-label="Coming soon"
                placement="bottom"
                hasArrow
                arrowSize={15}
                backgroundColor="bglight"
                color="headingGrey"
                boxShadow="none"
                py={1}
                px={2}
                mt={2}
                borderRadius="md"
              >
                <Text color="textExtraLight" cursor="default">
                  {t("rent")}
                </Text>
              </Tooltip>

              <Tooltip
                label={t("comingSoon")}
                aria-label="Coming soon"
                placement="bottom"
                hasArrow
                arrowSize={15}
                backgroundColor="bglight"
                color="headingGrey"
                boxShadow="none"
                py={1}
                px={2}
                mt={2}
                borderRadius="md"
              >
                <Text color="textExtraLight" cursor="default">
                  {t("fractionalize")}
                </Text>
              </Tooltip>
            </HStack>
            <Spacer />
            <Flex alignItems="center">
              <SelectLang />
              {/* <IconButton
                aria-label="Toggle Theme"
                size="sm"
                onClick={toggleColorMode}
                backgroundColor="bglight"
              >
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </IconButton> */}
            </Flex>
          </>
        )}

        {!isLargerThanLG && (
          <IconButton
            aria-label="Toggle Menu"
            onClick={onOpen}
            backgroundColor="bglight"
          >
            <Icon as={FaAlignJustify} />
          </IconButton>
        )}
      </Flex>
    </Container>
  );
};
