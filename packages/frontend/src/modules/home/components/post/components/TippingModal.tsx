import confetti from "canvas-confetti";
import { useCustomToast } from "@/hooks";
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
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr
} from "@chakra-ui/react";
import { FC, useState } from "react";

type TippingModalProps = {
  tipAmount: number;
  setTipAmount: (amount: number) => void;
  handleTip: () => Promise<boolean>;
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
  const [isLoading, setIsLoading] = useState(false);
  const { successToast, errorToast } = useCustomToast();

  const onTip = async () => {
    setIsLoading(true);
    try {
      const success = await handleTip();
      if (success) {
        setIsTipModalOpen(false);
        successToast("Tip sent successfully");
        sendConfetti();
      } else {
        errorToast("Failed to send tip");
      }
    } catch (error) {
      console.error("Error sending tip:", error);
      errorToast("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const sendConfetti = () => {
    const scalar = 2;
    const triangle = confetti.shapeFromPath({
      path: "M0 10 L5 0 L10 10z"
    });
    const square = confetti.shapeFromPath({
      path: "M0 0 L10 0 L10 10 L0 10 Z"
    });
    const coin = confetti.shapeFromPath({
      path: "M5 0 A5 5 0 1 0 5 10 A5 5 0 1 0 5 0 Z"
    });
    const tree = confetti.shapeFromPath({
      path: "M5 0 L10 10 L0 10 Z"
    });

    const defaults = {
      spread: 360,
      ticks: 180,
      gravity: 0,
      decay: 0.96,
      startVelocity: 20,
      shapes: [triangle, square, coin, tree],
      scalar
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 30
      });

      confetti({
        ...defaults,
        particleCount: 5
      });

      confetti({
        ...defaults,
        particleCount: 15,
        scalar: scalar / 2,
        shapes: ["circle"]
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  const commissionAmount = tipAmount * 0.05;
  const totalAmount = tipAmount + commissionAmount;

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
                borderTopRightRadius="1.125em"
                borderBottomRightRadius="1.125em"
              >
                CORE
              </InputRightAddon>
            </InputGroup>
          </FormControl>
          <TableContainer whiteSpace="normal" mt="1.5em">
            <Table variant="unstyled" layout="fixed">
              <Tbody>
                <Tr>
                  <Td pl="0" py="0.5em" w="70%">
                    Author gets:
                  </Td>
                  <Td px="0" py="0.5em" textAlign="right">
                    {tipAmount ? tipAmount.toFixed(2) : "0.00"} CORE
                  </Td>
                </Tr>
                <Tr borderBottom="1px solid black">
                  <Td pl="0" pt="0.5em" pb="1em" w="70%">
            Platform commission 5%:
                  </Td>
                  <Td px="0" pt="0.5em" pb="1em" textAlign="right">
                    {tipAmount ? commissionAmount.toFixed(2) : "0.00"} CORE
                  </Td>
                </Tr>
                <Tr>
                  <Td pl="0" pt="1em" pb="0.5em" w="70%">
                    Total to pay:
                  </Td>
                  <Td px="0" pt="1em" pb="0.5em" textAlign="right">
                    {tipAmount ? totalAmount.toFixed(2) : "0.00"} CORE
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="primary"
            isDisabled={tipAmount === 0 || isLoading}
            onClick={onTip}
            isLoading={isLoading}
          >
            Pay {totalAmount.toFixed(2)} CORE
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
