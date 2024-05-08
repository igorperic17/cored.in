import { useFeatureFlagContext } from "@/contexts/featureFlag";
import { Flex, Text, Button, Box, ButtonGroup } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { FEATURE_FLAG } from "@coredin/shared";

export const COOKIES_ACCEPTANCE_COOKIE_NAME = "CookiesConsent";

export const CookiesBar = () => {
  const { isInitialised, isFeatureEnabled } = useFeatureFlagContext();
  const isEnabled = useMemo(
    () => isInitialised && isFeatureEnabled(FEATURE_FLAG.COOKIES),
    [isInitialised, isFeatureEnabled]
  );
  const [cookies, setCookie, removeCookie] = useCookies([
    COOKIES_ACCEPTANCE_COOKIE_NAME
  ]);
  const [rejected, setRejected] = useState(false);

  if (!isEnabled) {
    return false;
  }

  return (
    <>
      {!cookies.CookiesConsent && !rejected && (
        <Box
          bg="background.900"
          opacity="0.95"
          maxW="100vw"
          borderTopWidth="1px"
          borderTopStyle="solid"
          borderTopColor="brand.500"
          position="sticky"
          bottom="0"
          zIndex="sticky"
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            gap="1em"
            justify="space-between"
            align="center"
            textAlign={{ base: "center", md: "left" }}
            maxW="1400px"
            mx="auto"
            px={{ base: "1.5em", md: "2.5em", lg: "3.5em", xl: "4em" }}
            py="0.5em"
          >
            <Text fontWeight="700">
              This website uses cookies to improve the user experience.
            </Text>
            <ButtonGroup spacing="2em">
              <Button
                variant="empty"
                onClick={() => {
                  removeCookie(COOKIES_ACCEPTANCE_COOKIE_NAME);
                  setRejected(true);
                }}
              >
                Reject
              </Button>
              <Button
                variant="empty"
                onClick={() => setCookie(COOKIES_ACCEPTANCE_COOKIE_NAME, true)}
              >
                Accept
              </Button>
            </ButtonGroup>
          </Flex>
        </Box>
      )}
    </>
  );
};
