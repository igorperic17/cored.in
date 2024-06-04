import { ROUTES } from "@/router/routes";
import { Link as ReactRouterLink } from "react-router-dom";
import { navigationData } from "../constants/navigationData";
import {
  Box,
  Flex,
  Grid,
  HStack,
  Icon,
  Link,
  Text,
  useMediaQuery,
  useTheme
} from "@chakra-ui/react";
import { FaTriangleExclamation } from "react-icons/fa6";

export const Navigation = () => {
  const theme = useTheme();
  const [isLargerThanLg] = useMediaQuery(
    `(min-width: ${theme.breakpoints.lg})`
  );

  return (
    <Box
      as="nav"
      w="100%"
      position={{ base: "fixed", lg: "static" }}
      bottom={{ base: "0", lg: "" }}
      layerStyle="cardBox"
      borderRadius={{ base: "0", lg: "0.5em" }}
      p={{ base: "0", lg: "1em" }}
      zIndex="1"
      borderTop={{ base: "1px solid", lg: "none" }}
      borderTopColor="background.600"
    >
      <Grid
        as="ul"
        templateColumns={{ base: "repeat(5, 1fr)", lg: "repeat(1, 1fr)" }}
        gap="0.5em"
        listStyleType="none"
        w="100%"
        // border="1px solid red"
      >
        {navigationData.map((item, index) => (
          <Flex
            as="li"
            key={`home-navigation-${index}`}
            color="text.100"
            justify="center"
            align="center"
            // p="1em"
          >
            <Link
              as={ReactRouterLink}
              to={item.link}
              fontSize="1.375rem"
              color="inherit"
              w={{ base: "max-content", lg: "100%" }}
              _hover={{
                div: {
                  background: "background.600"
                }
                // textDecoration: "none"
              }}
              _focus={{
                div: {
                  background: "background.600"
                }
                // outline: "none",
                // textDecoration: "none"
              }}
            >
              <HStack
                spacing="0.75em"
                p="0.75em"
                borderRadius="0.5em"
                w={{ base: "max-content", lg: "100%" }}
              >
                <Icon as={item.icon} />
                {isLargerThanLg && (
                  <Text as="span">{`${item.title[0].toUpperCase()}${item.title.slice(1)}`}</Text>
                )}
              </HStack>
            </Link>
          </Flex>
        ))}
        {!isLargerThanLg && (
          <Flex
            as="li"
            key={`home-navigation-mobile-4`}
            p="0.5em"
            borderRadius="0.5em"
            listStyleType="none"
            w="max-content"
            mx="auto"
            justify="center"
            align="center"
          >
            <Icon as={FaTriangleExclamation} fontSize="1.375rem" />
          </Flex>
        )}
      </Grid>
    </Box>
  );
};
