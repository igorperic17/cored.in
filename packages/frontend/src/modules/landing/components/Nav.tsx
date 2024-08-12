import { Flex, Link, useMediaQuery, useTheme, Box } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { ROUTES } from "@/router/routes";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useAuth, useLoggedInServerState } from "@/hooks";
import { LoginButton, Logo } from "@/components";
import { USER_QUERIES } from "@/queries";
import { useChain } from "@cosmos-kit/react";
import { NAV_SECTIONS } from "../constants";
import { useSectionInView } from "../hooks";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Nav = () => {
  const currentSection = useSectionInView();
  const theme = useTheme();
  const [isLargerThanLg] = useMediaQuery(
    `(min-width: ${theme.breakpoints.lg})`
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
        backgroundBlendMode="overlay"
        backdropFilter="blur(12px)"
        border="1px solid #29292940"
        // borderColor="brand.300"
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
          <Logo w="148px" h="24px" />
        </Link>

        {isLargerThanLg && (
          <Box
            as="nav"
            w="60%"
            maxW="540px"
            // border="1px solid red"
            //
          >
            <Flex
              as="ul"
              justify="space-between"
              gap="1.5em"
              listStyleType="none"
            >
              {Object.values(NAV_SECTIONS).map((item, index) => {
                return (
                  <Box as="li" key={`menu-section-li-${index}`}>
                    <Link
                      as={ReactRouterLink}
                      to={`#${item}`}
                      textDecoration="none"
                      fontSize={{ md: "0.875rem", lg: "1.125rem" }}
                      lineHeight="1.25"
                      textTransform="uppercase"
                      color={
                        currentSection === item ? "brand.200" : "brand.100"
                      }
                      _hover={{ color: "brand.200" }}
                      // _active={{ color: "black" }}
                    >
                      {item === NAV_SECTIONS.WHY_COREDIN
                        ? "Why cored.in?"
                        : item}
                    </Link>
                  </Box>
                );
              })}
            </Flex>
          </Box>
        )}
        <LoginButton
          variant="primary"
          signInText="Sign in"
          username={userProfile?.username}
        />
      </Flex>
    </Box>
  );
};
