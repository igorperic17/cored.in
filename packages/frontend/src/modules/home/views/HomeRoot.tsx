import {
  DisclaimerText,
  Header,
  Logo,
  MainBackground,
  SocialMedia
} from "@/components";
import { useAuth, useLoggedInServerState } from "@/hooks";
import {
  MobileMenu,
  NavigationDesktop,
  UserSignOut
} from "@/modules/home/components";
import { USER_QUERIES } from "@/queries";
import { ROUTES } from "@/router/routes";
import {
  Box,
  Grid,
  Link,
  VStack,
  useMediaQuery,
  useTheme
} from "@chakra-ui/react";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import {
  Navigate,
  Outlet,
  ScrollRestoration,
  useLocation
} from "react-router-dom";
import { Link as ReactRouterLink } from "react-router-dom";
import StickyBox from "react-sticky-box";

export const HomeRoot = () => {
  const theme = useTheme();
  const [isLargerThanLg] = useMediaQuery(
    `(min-width: ${theme.breakpoints.lg})`
  );
  const location = useLocation();
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const { needsAuth } = useAuth();
  const { data: userProfile } = useLoggedInServerState(
    USER_QUERIES.getUser(chainContext.address || "", needsAuth),
    {
      enabled: !!chainContext.address
    }
  );
  if (!chainContext.isWalletConnected) {
    return (
      <Navigate
        to={
          ROUTES.LOGIN.path + "?redirect=" + location.pathname + location.search
        }
      />
    );
  }

  return (
    <Box
      w="100%"
      maxW="1920px"
      mx="auto"
      bg="brand.100"
      position="relative"
      zIndex="0"
    >
      {!isLargerThanLg && userProfile && (
        <Header username={userProfile.username}>
          <MobileMenu />
        </Header>
      )}

      <Grid
        pt="1.5em"
        pb={{ base: "4.5em", lg: "1.5em" }}
        px={{ base: "0.5em", sm: "1em", md: "2.5em" }}
        templateColumns={{
          base: "100%",
          lg: "minmax(300px, 20%) minmax(600px, 50%)"
        }}
        gap={{ base: "0.5em", lg: "3%" }}
        // border="1px solid green"
        alignItems="flex-start" // important for the StickyBox to work
      >
        {!isLargerThanLg && (
          <VStack
            as="aside"
            h="max-content"
            layerStyle="cardBox"
            py="1em"
            spacing="0.25em"
            align="start"
            mt="-1em"
          >
            <DisclaimerText size="xs" />
            <SocialMedia showOnlyDiscord size="1.75rem" color="other.600" />
          </VStack>
        )}
        {isLargerThanLg && (
          <StickyBox offsetTop={24} offsetBottom={24}>
            <VStack
              spacing="1.25em"
              // border="1px solid red"
              //
            >
              <Box layerStyle="cardBox" p="2em" w="100%">
                <Link
                  as={ReactRouterLink}
                  to={
                    chainContext.address ? ROUTES.HOME.path : ROUTES.ROOT.path
                  }
                  aria-label={
                    chainContext.address ? "Home page." : "Main page."
                  }
                  _hover={{ textDecoration: "none" }}
                >
                  <Logo w="148px" h="auto" aspectRatio="6.17 / 1" />
                </Link>
              </Box>
              <VStack
                as="aside"
                h="max-content"
                layerStyle="cardBox"
                py="1em"
                spacing="0.25em"
                align="start"
              >
                <DisclaimerText size="xs" />
                <SocialMedia showOnlyDiscord size="1.75rem" color="other.600" />
              </VStack>
              <NavigationDesktop wallet={chainContext.address || ""} />
              <UserSignOut />
            </VStack>
          </StickyBox>
        )}

        <Box as="main">
          <Outlet />
          <ScrollRestoration />
        </Box>
      </Grid>
      <MainBackground />
    </Box>
  );
};
