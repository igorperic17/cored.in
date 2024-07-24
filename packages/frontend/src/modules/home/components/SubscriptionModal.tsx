import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr
} from "@chakra-ui/react";
import { FC } from "react";

export const SubscriptionModal: FC<Omit<ModalProps, "children">> = ({
  isOpen,
  onClose
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Subscription</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text textStyle="sm" mb="1em">
            By subscribing to this profile you will be able to see their private
            information and send messages.
          </Text>

          <TableContainer whiteSpace="normal" mb="1em">
            <Table variant="unstyled" layout="fixed">
              <Tbody>
                <Tr>
                  <Td pl="0" pb="0">
                    Username:
                  </Td>
                  <Td px="0" pb="0">
                    @someusername
                  </Td>
                </Tr>
                <Tr>
                  <Td pl="0" pb="0">
                    Price:
                  </Td>
                  <Td px="0" pb="0">
                    4.45 CORE
                  </Td>
                </Tr>
                <Tr>
                  <Td pl="0" pb="0">
                    Duration:
                  </Td>
                  <Td px="0" pb="0">
                    1 week
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>

        <ModalFooter>
          <Button variant="empty" size="sm" onClick={onClose} mr="1.5em">
            Close
          </Button>
          <Button variant="primary" size="sm">
            Subscribe
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
