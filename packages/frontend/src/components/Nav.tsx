import { FC, useState } from "react";
import {
  Text,
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
  useMediaQuery,
  Img,
  HStack,
  Link,
  Box,
  Button,
  Heading,
  Circle
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useLocation } from "react-router-dom";
import { Login } from "./Login";

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
      // border="1px solid red"
      w="100vw"
      maxW="1680px"
      h="20%"
    >
      <Flex
        p="1em 2em"
        direction="row"
        justify="space-between"
        align="center"

        // position="sticky"
        // zIndex="sticky"
      >
        <Heading as="h1" fontSize="2rem">
          Cored
          <Text display="inline" color="colors.brand.600">
            In
          </Text>
        </Heading>
        <Flex
          direction="row"
          justify="space-between"
          align="center"
          w="20%"
          fontSize="1rem"
          textTransform="uppercase"
          // border="1px solid red"
        >
          <Link>Home</Link>
          <Link>Link1</Link>
          <Link>Link2</Link>
          <Link>Link3</Link>
        </Flex>
        <Login />
      </Flex>
    </Box>
  );
};
