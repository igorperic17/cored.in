import { useCustomToast } from "@/hooks";
import { formElementBorderStyles } from "@/themes";
import {
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
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
import { FC, useState } from "react";

type TransferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
};

export const TransferModal: FC<TransferModalProps> = ({
  isOpen,
  onClose,
  balance
}) => {
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [toWalletAddress, setToWalletAddress] = useState("");
  const { successToast, errorToast } = useCustomToast(); // TODO: implement in the code

  const isInvalidTransferAmount = transferAmount && transferAmount > balance;

  const handleClose = () => {
    onClose();
    setTransferAmount(0);
    setToWalletAddress("");
  };
  //   console.log("transferAmount", transferAmount, typeof transferAmount);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Transfer to your wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap="2em">
            <Flex direction="column-reverse" gap="0em">
              <Heading
                as="h2"
                color="other.200"
                fontSize="1rem"
                textTransform="uppercase"
              >
                My balance
              </Heading>
              <Text as="span" fontSize="2rem" fontWeight="700">
                {`${2870} CORE`}
              </Text>
            </Flex>
            <FormControl>
              <FormLabel>Amount</FormLabel>
              <InputGroup justifyContent="center" alignItems="center">
                <Input
                  textAlign="center"
                  alignContent="center"
                  type="number"
                  min="0"
                  max={`${balance}`}
                  placeholder={`${balance}`}
                  {...formElementBorderStyles}
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Number(e.target.value))}
                  isInvalid={isInvalidTransferAmount || false}
                />
                <InputRightAddon
                  color="brand.100"
                  bg={"brand.300"}
                  border="1px solid"
                  borderColor="other.200"
                  borderTopRightRadius="1.125em"
                  borderBottomRightRadius="1.125em"
                >
                  CORE
                </InputRightAddon>
              </InputGroup>
              {/* {isInvalidTransferAmount && (
                <FormHelperText color="brand.400">
                  Transfer amount cannot be greater than your current balance
                </FormHelperText>
              )} */}
            </FormControl>
            <FormControl>
              <FormLabel>Wallet address</FormLabel>
              <Input
                type="text"
                {...formElementBorderStyles}
                placeholder="0x..."
                value={toWalletAddress}
                onChange={(e) => setToWalletAddress(e.target.value)}
              />
            </FormControl>
          </Flex>
        </ModalBody>

        <ModalFooter mt="1.5em">
          <Button
            variant="empty"
            color="other.600"
            size="sm"
            onClick={handleClose}
            mr="1.5em"
          >
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {}}
            isDisabled={isInvalidTransferAmount || !toWalletAddress}
          >
            Transfer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
