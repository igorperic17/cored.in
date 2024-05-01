import { FC } from "react";
import {
  Text,
  Flex,
  Heading,
  Button,
  Link,
  HStack,
  useMediaQuery,
  useTheme
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import { useFeatureFlagContext } from "@/contexts/featureFlag";
import { FEATURE_FLAG } from "@coredin/shared";
import { navSections } from "@/constants";
import { useSectionInView } from "@/hooks";

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
      direction="row"
      justify="space-between"
      align="center"
      position="sticky"
      top="0"
      h={{ base: "8vh", md: "10vh", xl: "11vh" }}
      w="100%"
      maxW="1920px"
      mx="auto"
      px={{ base: "1.5em", md: "2.5em", lg: "3.5em", xl: "4em" }}
      background="background.900"
    >
      <Heading as="h1" fontSize={{ base: "2rem", md: "3rem" }}>
        cored
        {/* <Text as="span" color="brand.500">
          .in
        </Text> */}
      </Heading>
      {isLargerThanMd && (
        <HStack>
          {navSections.map((item, index) => {
            return (
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
            );
          })}
        </HStack>
      )}
      {isInitialised && isFeatureEnabled(FEATURE_FLAG.APP) && (
        <Link as={ReactRouterLink} to={ROUTES.APP.path}>
          <Button variant="primary" size="md">
            Sign In
          </Button>
        </Link>
      )}
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
