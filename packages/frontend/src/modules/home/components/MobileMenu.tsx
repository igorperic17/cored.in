import {
  Button,
  Center,
  Modal,
  ModalCloseButton,
  ModalContent,
  useDisclosure
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa6";
import { NavigationList, UserSignOut } from ".";
import { useChain } from "@cosmos-kit/react";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";

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
          <ModalContent as="nav" h="100%">
            <ModalCloseButton />
            <Center flexDirection="column" gap="12%" px="1em" h="100%">
              <NavigationList
                wallet={chainContext.address || ""}
                isPostPage={false}
                pendingRequests={undefined}
                unreadMessages={0}
                unseenTips={0}
                closeMobileMenu={onClose}
              />

              <UserSignOut isMobile w="max-content" />
            </Center>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
