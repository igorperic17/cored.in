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
  useTheme
} from "@chakra-ui/react";
import { FaTriangleExclamation } from "react-icons/fa6";
import { FC } from "react";
import { Disclaimer, SocialMedia } from "@/components";

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

  return (
    <Box
      as="nav"
      w="100%"
      position={{ base: "fixed", lg: "static" }}
      bottom={{ base: "0", lg: "" }}
      layerStyle="cardBox"
      p={{ base: "0", lg: "1em" }}
      zIndex="1"
      // border="1px solid red"
    >
      <Grid
        as="ul"
        templateColumns={{ base: "repeat(5, 1fr)", lg: "repeat(1, 1fr)" }}
        gap="0.5em"
        listStyleType="none"
        w="100%"
        // border="1px solid red"
      >
        {navigationData(wallet).map((item, index) => (
          <Flex
            as="li"
            key={`home-navigation-${index}`}
            color="text.100"
            justify="center"
            align="center"
          >
            <Link
              as={ReactRouterLink}
              to={item.link}
              fontSize="1.375rem"
              color={
                location.pathname === item.link || isLargerThanLg
                  ? "inherit"
                  : "text.400"
              }
              w={{ base: "100%", lg: "100%" }}
              bg={
                location.pathname === item.link && isLargerThanLg
                  ? "background.600"
                  : "none"
              }
              borderRadius={{ base: "none", lg: "0.5em" }}
              _hover={{
                div: {
                  background: "background.600",
                  borderRadius: "inherit"
                }
              }}
            >
              <HStack
                spacing="0.75em"
                p="0.75em"
                w={{ base: "100%", lg: "100%" }}
              >
                <Icon as={item.icon} mx={{ base: "auto", lg: "0" }} />
                {isLargerThanLg && (
                  <Text as="span">{`${item.title[0].toUpperCase()}${item.title.slice(1)}`}</Text>
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
                p="1em"
                w="100%"
                h="100%"
              >
                <Icon as={FaTriangleExclamation} fontSize="1.5rem" />
              </Button>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay />
              <ModalContent bg="transparent">
                <ModalCloseButton color="text.100" />
                <ModalBody layerStyle="cardBox">
                  <Disclaimer />
                  <SocialMedia size="1.75rem" gap="2.25em" color="text.400" />
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        )}
      </Grid>
    </Box>
  );
};
