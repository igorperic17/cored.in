import { formElementBorderStyles } from "@/themes";
import {
  Button,
  Flex,
  FormControl,
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
import {
  TESTNET_CHAIN_BECH32_PREFIX,
  TESTNET_CHAIN_NAME,
  TESTNET_FEE_DENOM,
  TESTNET_GAS_PRICE
} from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";

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
  const { address, sign, broadcast } = useChain(TESTNET_CHAIN_NAME);
  const [transferAmount, setTransferAmount] = useState<number>(0);
  const [toAddress, setToAddress] = useState("");
  const isInvalidTransferAmount = transferAmount && transferAmount > balance;

  const handleClose = () => {
    onClose();
    setTransferAmount(0);
    setToAddress("");
  };

  // TODO - move decimals to shared...
  // TODO - debug
  const handleSend = () => {
    // Encode a send message.
    const msg = {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: {
        fromAddress: address,
        toAddress,
        amount: [
          {
            denom: TESTNET_FEE_DENOM,
            amount: (transferAmount * 1000000).toString()
          }
        ]
        // type: "/cosmos.bank.v1beta1.MsgSend"
      }
    };
    const fee = {
      amount: [{ denom: TESTNET_FEE_DENOM, amount: TESTNET_GAS_PRICE }],
      gas: "200000"
    };
    const memo = "Transfered from cored.in";

    sign([msg], fee, memo).then((value) => broadcast(value)); // , fee, memo
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Transfer to another wallet</ModalHeader>
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
                Wallet balance
              </Heading>
              <Text as="span" fontSize="2rem" fontWeight="700">
                {`${balance} CORE`}
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
                placeholder={`${TESTNET_CHAIN_BECH32_PREFIX}...`}
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
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
            onClick={handleSend}
            isDisabled={isInvalidTransferAmount || !toAddress}
          >
            Transfer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
