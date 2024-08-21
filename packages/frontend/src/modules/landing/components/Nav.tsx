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
        bg="#FFFFFFBF"
        backdropFilter="blur(12px)"
        border="1px solid #E7E7E740"
        borderRadius="1em"
        boxShadow="
          5px 4px 14px 0px #1414130D,
          18px 17px 25px 0px #1414130A,
          41px 38px 34px 0px #14141305,
          72px 68px 40px 0px #14141303,
          113px 106px 43px 0px #14141300"
        p={{ base: "0.688em", xl: "1em" }}
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
          <Logo
            w={{ base: "120px", md: "148px" }}
            h="auto"
            aspectRatio="6.17 / 1"
          />
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
                        currentSection === item ? "brand.300" : "brand.900"
                      }
                      _hover={{ color: "brand.300" }}
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
          size="md"
          signInText="Sign in"
          username={userProfile?.username}
        />
      </Flex>
    </Box>
  );
};
