import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  useDisclosure
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa6";
import { NavigationList } from ".";
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
          <ModalCloseButton />
          <ModalContent as="nav">
            <NavigationList
              wallet={""}
              isPostPage={false}
              pendingRequests={undefined}
              unreadMessages={0}
              hasDisclaimer={true}
            />
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
