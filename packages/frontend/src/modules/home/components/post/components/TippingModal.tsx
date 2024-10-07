import { formElementBorderStyles } from "@/themes";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from "@chakra-ui/react";
import { FC } from "react";

type TippingModalProps = {
  tipAmount: number;
  setTipAmount: (amount: number) => void;
  handleTip: () => Promise<void>;
  isTipModalOpen: boolean;
  setIsTipModalOpen: (open: boolean) => void;
};

export const TippingModal: FC<TippingModalProps> = ({
  tipAmount,
  setTipAmount,
  handleTip,
  isTipModalOpen,
  setIsTipModalOpen
}) => {
  return (
    <Modal
      isOpen={isTipModalOpen}
      onClose={() => setIsTipModalOpen(false)}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Send Tip</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Enter the amount of CORE you'd like to tip.</FormLabel>
            <InputGroup>
              <Input
                type="number"
                min="0"
                placeholder="5.50"
                w="120px"
                {...formElementBorderStyles}
                value={tipAmount}
                onChange={(e) => setTipAmount(Number(e.target.value))}
              />
              <InputRightAddon
                color="brand.900"
                bg="text.300"
                border="1px solid #141413"
              >
                CORE
              </InputRightAddon>
            </InputGroup>
          </FormControl>
          <Text mt="2em" textStyle="sm">
            Author gets 95%:
            <Text as="span" fontWeight="700" ml="1em">
              {tipAmount
                ? `${(tipAmount * 0.95).toFixed(2)} CORE`
                : "0.00 CORE"}
            </Text>
          </Text>
          <Text mt="1" textStyle="sm">
            Platform commission 5%:
            <Text as="span" fontWeight="700" ml="1em">
              {tipAmount
                ? `${(tipAmount * 0.05).toFixed(2)} CORE`
                : "0.00 CORE"}
            </Text>
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="primary"
            isDisabled={tipAmount === 0}
            onClick={handleTip}
          >
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
