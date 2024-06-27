import {
  Flex,
  Link,
  HStack,
  useMediaQuery,
  useTheme,
  Box
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { navSections } from "@/constants";
import { useAuth, useLoggedInServerState, useSectionInView } from "@/hooks";
import { Login, Logo } from "@/components";
import { USER_QUERIES } from "@/queries";
import { useChain } from "@cosmos-kit/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Nav = () => {
  const currentSection = useSectionInView();
  const theme = useTheme();
  const [isLargerThanMd] = useMediaQuery(
    `(min-width: ${theme.breakpoints.md})`
  );
  const { needsAuth } = useAuth();
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const { data: userProfile } = useLoggedInServerState(
    USER_QUERIES.getUser(chainContext.address || "", needsAuth),
    {
      enabled: !!chainContext.address
    }
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
                <li key={`menu-section-item-${index}`}>
                  <Link
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
        to={ROUTES.LOGIN.path}
        _hover={{ textDecoration: "none" }}
      >
        <Login
          variant="primary"
          signInText="Sign in"
          username={userProfile?.username}
        />
      </Link>
    </Flex>
  );
};
