import {
  Box,
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa6";
import { NavigationList, UserSignOut } from ".";
import { useChain } from "@cosmos-kit/react";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { DisclaimerText, SocialMedia } from "@/components";

export const MobileMenu = () => {
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        rightIcon={<FaBars />}
        aria-label="Menu."
        bg="none"
        _hover={{ bg: "none" }}
        _active={{ bg: "none" }}
        onClick={onOpen}
      />
      {isOpen && (
        <Modal size="full" isOpen={isOpen} onClose={onClose}>
          <ModalContent as="nav">
            <ModalCloseButton />
            <NavigationList
              wallet={chainContext.address || ""}
              isPostPage={false}
              pendingRequests={undefined}
              unreadMessages={0}
            />

            <Box mt="3em" mb="2em">
              <UserSignOut isMobile />
            </Box>

            <VStack spacing="1em" mt="1em">
              <DisclaimerText />
              <SocialMedia size="1.5rem" gap="1.75em" color="other.600" />
            </VStack>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
