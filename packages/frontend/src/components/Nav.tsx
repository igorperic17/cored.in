import { FC } from "react";
import {
  Flex,
  Button,
  Link,
  HStack,
  useMediaQuery,
  useTheme,
  Box
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import { useFeatureFlagContext } from "@/contexts/featureFlag";
import { FEATURE_FLAG } from "@coredin/shared";
import { navSections } from "@/constants";
import { useSectionInView } from "@/hooks";
import { Logo } from "./Logo";
import { Login } from "./Login";

export interface NavProps {
  onOpen: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Nav: FC<NavProps> = ({ onOpen }) => {
  const { isInitialised, isFeatureEnabled } = useFeatureFlagContext();
  const currentSection = useSectionInView();
  const theme = useTheme();
  const [isLargerThanMd] = useMediaQuery(
    `(min-width: ${theme.breakpoints.md})`
  );

  return (
    <Flex
      as="header"
      id="nav"
      direction="row"
      justify="space-between"
      align="center"
      position="sticky"
      top="0"
      h={{ base: "8vh", md: "9vh" }} // NOTE: Do not modify this only as the page sections also rely on vh to ensure content does not overlap.
      w="100%"
      maxW="1920px"
      mx="auto"
      px={{ base: "1.5em", md: "2.5em", lg: "3.5em", xl: "4em" }}
      background="background.900"
      // background="red"
      zIndex="10"
    >
      <Link
        as={ReactRouterLink}
        to={ROUTES.ROOT.path}
        _hover={{ textDecoration: "none" }}
      >
        <Logo fontSize={{ base: "2rem", md: "3rem" }} />
      </Link>
      {isLargerThanMd && (
        <Box as="nav">
          <HStack as="ul" spacing="1.5em" listStyleType="none">
            {navSections.map((item, index) => {
              return (
                <li>
                  <Link
                    key={`menu-section-item-${index}`}
                    as={ReactRouterLink}
                    to={item.link}
                    textDecoration="none"
                    textTransform="uppercase"
                    color={currentSection === item.title ? "brand.500" : ""}
                    fontSize="1.2em"
                    // fontFamily="heading"
                    _hover={{ color: "brand.500" }}
                    //_focus={{ color: "text.500" }}
                    _active={{ color: "" }}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </HStack>
        </Box>
      )}
      <Link
        as={ReactRouterLink}
        to={ROUTES.APP.path}
        _hover={{ textDecoration: "none" }}
      >
        <Login variant="primary" signInText="Sign in" />
      </Link>
      {isInitialised && !isFeatureEnabled(FEATURE_FLAG.APP) && (
        <Link as={ReactRouterLink} to={"#benefits"}>
          <Button variant="primary" size="md">
            Learn more
          </Button>
        </Link>
      )}
      {/* Placeholder while not initalized to avoid section links going to right */}
      {!isInitialised && <Link as={ReactRouterLink} to={"#"}></Link>}
    </Flex>
  );
};
