import { Link as ReactRouterLink, useLocation } from "react-router-dom";
import { navigationData } from "../constants/navigationData";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  useMediaQuery,
  useTheme,
  VStack
} from "@chakra-ui/react";
import { FaTriangleExclamation } from "react-icons/fa6";
import { FC } from "react";
import { DisclaimerText, SocialMedia } from "@/components";
import { useLoggedInServerState } from "@/hooks";
import { ISSUER_QUERIES } from "@/queries/IssuerQueries";
import { CredentialRequestStatus } from "@coredin/shared";

type NavigationProps = {
  wallet: string;
};

export const Navigation: FC<NavigationProps> = ({ wallet }) => {
  const location = useLocation();
  const theme = useTheme();
  const [isLargerThanLg] = useMediaQuery(
    `(min-width: ${theme.breakpoints.lg})`
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: pendingRequests } = useLoggedInServerState(
    ISSUER_QUERIES.getRequests(CredentialRequestStatus?.PENDING || "PENDING")
  );

  return (
    <Box
      as="nav"
      w="100%"
      position={{ base: "fixed", lg: "static" }}
      bottom={{ base: "0", lg: "" }}
      layerStyle="cardBox"
      borderBottomRadius={{ base: "0", lg: "1em" }}
      pl={{ base: "0", lg: "2em" }}
      zIndex="1"
      // border="1px solid red"
    >
      <Grid
        as="ul"
        templateColumns={{ base: "repeat(7, 1fr)", lg: "repeat(1, 1fr)" }}
        justifyContent="space-between"
        gap={{ base: "0", lg: "2em" }}
        listStyleType="none"
        w="100%"
        // border="1px solid red"
      >
        {navigationData(wallet).map((item, index) => (
          <Flex
            as="li"
            key={`home-navigation-${index}`}
            justify="center"
            align="center"
            // border="1px solid red"
          >
            <Link
              as={ReactRouterLink}
              to={item.link}
              fontSize="1.375rem"
              fontWeight="600"
              color={
                location.pathname === item.link && isLargerThanLg
                  ? "brand.300"
                  : "brand.900"
              }
              w={{ base: "100%", lg: "100%" }}
              _hover={{
                "& > div": {
                  color: "brand.300"
                }
              }}
            >
              <HStack
                spacing={{ base: "0", lg: "0.75em" }}
                w={{ base: "100%", lg: "100%" }}
                // border="1px solid white"
                position="relative"
              >
                <Icon
                  as={item.icon}
                  mx={{ base: "auto", lg: "0" }}
                  fontSize={{ base: "1.25rem", sm: "1.5rem" }}
                />
                {isLargerThanLg && (
                  <Text as="span">{`${item.title[0].toUpperCase()}${item.title.slice(1)}`}</Text>
                )}
                {item.title === "credentials" &&
                  pendingRequests?.length !== 0 && (
                    <Box
                      bg="brand.300"
                      w="7px"
                      h="7px"
                      borderRadius="50%"
                      alignSelf="start"
                      ml="-0.25em"
                      position={{ base: "absolute", lg: "static" }}
                      top={{ base: "-4px" }}
                      right={{ base: "8px", sm: "16px", md: "30px" }}
                    ></Box>
                  )}
              </HStack>
            </Link>
          </Flex>
        ))}
        {!isLargerThanLg && (
          <>
            <Flex as="li" justify="center" align="center">
              <Button
                aria-label="Disclaimer."
                variant="empty"
                color="text.400"
                onClick={onOpen}
                py="0.75em"
                px="0.5em"
                w="100%"
                h="100%"
              >
                <Icon
                  as={FaTriangleExclamation}
                  fontSize={{ base: "1.25rem", sm: "1.5rem" }}
                />
              </Button>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay />
              <ModalContent layerStyle="cardBox">
                <ModalCloseButton color="brand.900" />
                <ModalBody pt="2.5em">
                  <VStack spacing="2em">
                    <DisclaimerText />
                    <SocialMedia size="1.75rem" gap="2.25em" color="text.400" />
                  </VStack>
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        )}
      </Grid>
    </Box>
  );
};
