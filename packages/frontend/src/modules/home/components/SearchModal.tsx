import { formElementBorderStyles } from "@/themes";
import {
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from "@chakra-ui/react";
import { FC } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

type SearchModalType = {
  isSearchModalOpen: boolean;
  onSearchModalClose: () => void;
};

export const SearchModal: FC<SearchModalType> = ({
  isSearchModalOpen,
  onSearchModalClose
}) => {
  return (
    <Modal onClose={onSearchModalClose} isOpen={isSearchModalOpen} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Search for other users</ModalHeader>
        <ModalCloseButton />
        <ModalBody p="0">
          <FormControl>
            <InputGroup>
              <InputLeftElement>
                <FaMagnifyingGlass />
              </InputLeftElement>
              <Input
                type="text"
                {...formElementBorderStyles}
                placeholder="Search"
              />
            </InputGroup>
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
