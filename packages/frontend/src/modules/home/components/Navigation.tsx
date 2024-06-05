import { Link as ReactRouterLink } from "react-router-dom";
import { navigationData } from "../constants/navigationData";
import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useMediaQuery,
  useTheme
} from "@chakra-ui/react";
import { FaEllipsis, FaTrash, FaTriangleExclamation } from "react-icons/fa6";
import { FC } from "react";
import { IconButton } from "@interchain-ui/react";
import { Disclaimer } from "@/components";

type NavigationProps = {
  wallet: string;
};

export const Navigation: FC<NavigationProps> = ({ wallet }) => {
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
      borderTop={{ base: "1px solid", lg: "none" }}
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
            // border="1px solid white"
            borderRadius="0.5em"

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
          <>
            <Flex as="li" justify="center" align="center">
              <Button
                aria-label="Disclaimer."
                variant="empty"
                color="inherit"
                onClick={onOpen}
                p="1em"
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
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        )}
      </Grid>
    </Box>
  );
};
