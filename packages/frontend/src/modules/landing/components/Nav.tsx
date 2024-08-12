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
import { useAuth, useLoggedInServerState } from "@/hooks";
import { Login, Logo } from "@/components";
import { USER_QUERIES } from "@/queries";
import { useChain } from "@cosmos-kit/react";
import { NAV_SECTIONS } from "../constants";
import { useSectionInView } from "../hooks";
import BgNoise615 from "@/assets/bg-noise-6-15.png";

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
    <Box
      as="header"
      position="sticky"
      top={{ base: "1rem", md: "1.5rem", lg: "1.75rem" }}
      zIndex="10"
      px={{ base: "1em", md: "2.5em" }}
    >
      <Flex
        justify="space-between"
        alignItems="center"
        gap="3em"
        maxW="1840px"
        mx="auto"
        backgroundImage={BgNoise615}
        backgroundBlendMode="overlay"
        backdropFilter="blur(12px)"
        border="1px solid #29292940"
        borderRadius="1em"
        boxShadow="0px 4px 4px 0px #00000014"
        p={{ base: "0.688em", xl: "1em" }}
        // mt="16px" // might be needed
      >
        <Link
          as={ReactRouterLink}
          to={ROUTES.ROOT.path}
          aria-label="Main page."
          _hover={{
            textDecoration: "none"
          }}
          flexShrink="0"
        >
          <Link
            as={ReactRouterLink}
            to={ROUTES.ROOT.path}
            _hover={{ textDecoration: "none" }}
          >
            <Logo w="148px" h="24px" />
          </Link>
        </Link>

        {isLargerThanMd && (
          <Box
            as="nav"
            w="60%"
            maxW="450px"
            justifySelf="center"
            // border="1px solid red"
          >
            <HStack as="ul" spacing="1.5em" listStyleType="none">
              {NAV_SECTIONS.map((item, index) => {
                return (
                  <li key={`menu-section-item-${index}`}>
                    <Link
                      as={ReactRouterLink}
                      to={item.link}
                      textDecoration="none"
                      textTransform="uppercase"
                      color={currentSection === item.title ? "brand.500" : ""}
                      fontSize={{ base: "0.875rem", lg: "1rem" }}
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
    </Box>
  );
};
