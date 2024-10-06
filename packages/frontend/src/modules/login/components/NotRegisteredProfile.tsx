import { useCustomToast } from "@/hooks";
import { CopyIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Link,
  Text,
  VStack,
  VisuallyHidden
} from "@chakra-ui/react";
import { DID, TESTNET_CHAIN_NAME, TESTNET_STAKING_DENOM } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { ChangeEvent, FC, useEffect, useState } from "react";

interface ProfileRegistrationProps {
  did: DID;
  handleChangeUserName: (e: ChangeEvent<HTMLInputElement>) => void;
  usernameInput: string;
  registerProfile: () => void;
  isRegistering: boolean;
}

export const NotRegisteredProfile: FC<ProfileRegistrationProps> = ({
  did,
  handleChangeUserName,
  usernameInput,
  registerProfile,
  isRegistering
}) => {
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const [balance, setBalance] = useState(0);
  const { successToast } = useCustomToast();

  const getBalance = async () => {
    if (!chainContext.address) {
      setBalance(0);
      return;
    }

    const client = await chainContext.getCosmWasmClient();
    const coin = await client.getBalance(
      chainContext.address,
      TESTNET_STAKING_DENOM
    );

    // TODO - REVIEW DECIMALS AFTER TESTNET, utestcore has 6 decimals!
    setBalance(parseInt(coin.amount) / 1000000);
  };
  useEffect(() => {
    getBalance();
  }, [chainContext.address]);
  return (
    <HStack
      w="100%"
      maxW="1200px"
      minH="50vh"
      layerStyle="cardBox"
      mx="auto"
      mt="52px"
      justify="center"
      textAlign="center"
    >
      <VStack spacing="8em" maxW="700px" mx="auto">
        <Heading
          as="h2"
          fontSize={{ base: "1rem", md: "1.25rem" }}
          color="brand.900"
        >
          Here is your new Decentralised Identifier (DID):
          <Text
            as="span"
            display="block"
            color="brand.900"
            mt="0.5em"
            wordBreak="break-all"
          >
            {did.value}
          </Text>
        </Heading>
        <FormControl as="form">
          <VisuallyHidden>
            <FormLabel as="label">Enter a username</FormLabel>
          </VisuallyHidden>

          <Input
            variant="flushed"
            placeholder="Enter desired username"
            onChange={handleChangeUserName}
            value={usernameInput}
            focusBorderColor="brand.300"
            py="0.875em"
            textAlign="center"
            fontSize={{ base: "1.25rem", md: "1.75rem" }}
            color="brand.300"
          />
          <Text my="1em" color="text.300">
            At least 3 characters required, only letters and numbers allowed.
          </Text>
          {balance < 1 && (
            <VStack alignItems="center" gap="4px">
              <Text my="1em" color="brand.400">
                You're running low on CORE tokens, please top-up before
                registering! Connected wallet:
              </Text>
              {chainContext.address && (
                <Button
                  variant="empty"
                  size="sm"
                  color="text.700"
                  alignSelf="start"
                  rightIcon={<CopyIcon ml="0.5em" />}
                  aria-label="Copy connected wallet."
                  mt="-1em"
                  w="100%"
                  onClick={() => {
                    navigator.clipboard.writeText(chainContext.address!);
                    successToast("Wallet copied to clipboard");
                  }}
                >
                  {chainContext.address}
                </Button>
              )}
              <Link
                href={"https://docs.coreum.dev/docs/tools/faucet"}
                isExternal
                aria-label={`Link to coreum faucet.`}
                color="brand.500"
              // border="1px solid red"
              >
                Go to the Faucet
              </Link>
            </VStack>
          )}
          <Button
            mt="2em"
            isDisabled={usernameInput.length < 3 || balance < 1}
            onClick={registerProfile}
            size="md"
            variant="primary"
            isLoading={isRegistering}
          >
            REGISTER
          </Button>
        </FormControl>
      </VStack>
    </HStack>
  );
};
