import {
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
            {/* TODO: may be a good idea to revisit the spacing when we remove the disclaimer */}
            <VStack spacing={{ base: "5vh", sm: "8vh" }} px="1em">
              <NavigationList
                wallet={chainContext.address || ""}
                isPostPage={false}
                pendingRequests={undefined}
                unreadMessages={0}
                unseenTips={0}
                closeMobileMenu={onClose}
              />

              <UserSignOut isMobile w="max-content" />

              <VStack spacing="1em">
                <DisclaimerText />
                <SocialMedia size="1.5rem" gap="1.75em" color="other.600" />
              </VStack>
            </VStack>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
