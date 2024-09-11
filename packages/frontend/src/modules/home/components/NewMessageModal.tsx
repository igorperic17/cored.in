import { AutoResizeTextarea } from "@/components";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction } from "react";

export type NewMessageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  toUsername: string;
  postContent: string;
  setPostContent: Dispatch<SetStateAction<string>>;
  handleMessage: () => Promise<void>;
};

export const NewMessageModal: FC<NewMessageModalProps> = ({
  isOpen,
  onClose,
  toUsername,
  postContent,
  setPostContent,
  handleMessage
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setPostContent("");
      }}
      size="xl"
      isCentered
    >
      <ModalOverlay />
      <ModalContent p="0">
        <ModalHeader>New message to {toUsername}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <AutoResizeTextarea
            placeholder="Enter your message here"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            minH="50vh"
            variant="unstyled"
            borderRadius="0.5em"
            p="0.5em"
          />
        </ModalBody>

        <ModalFooter>
          <Button
            variant="empty"
            color="text.700"
            size="sm"
            onClick={onClose}
            mr="1.5em"
          >
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleMessage}>
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
