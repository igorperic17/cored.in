import {
  Flex,
  Text,
  Container,
  HStack,
  useMediaQuery,
  Button
} from "@chakra-ui/react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";

export const COOKIES_ACCEPTANCE_COOKIE_NAME = "CookiesConsent";

export const CookiesBar = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    COOKIES_ACCEPTANCE_COOKIE_NAME
  ]);
  const [rejected, setRejected] = useState(false);
  const [isLargerThanLG] = useMediaQuery("(min-width: 62em)");
  const { t } = useTranslation();

  return (
    <>
      {!cookies.CookiesConsent && !rejected && (
        <Container
          maxW="100vw"
          centerContent
          // bg="blackAlpha.50"
          borderTop="1px solid black"
          color="headingBlack"
          position="sticky"
          bottom="0"
          zIndex="sticky"
          bg="bglight"
          w="100%"
        >
          <Flex
            direction={isLargerThanLG ? "row" : "column"}
            gap={isLargerThanLG ? "1em" : "1.5em"}
            justify="space-between"
            // align={isLargerThanLG ? "center" : "center"}
            align="center"
            textAlign="center"
            maxW="1200px"
            w="100%"
            px="6"
            py="4"
          >
            <Text>{t("cookiesMsg")}</Text>
            <HStack>
              <Button
                variant="secondary"
                onClick={() => {
                  removeCookie(COOKIES_ACCEPTANCE_COOKIE_NAME);
                  setRejected(true);
                }}
              >
                {t("reject")}
              </Button>
              <Button
                variant="rounded"
                onClick={() => setCookie(COOKIES_ACCEPTANCE_COOKIE_NAME, true)}
              >
                {t("accept")}
              </Button>
            </HStack>
          </Flex>
        </Container>
      )}
    </>
  );
};