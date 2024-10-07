import { useCustomToast } from "@/hooks";
import { CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
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
import { TESTNET_CHAIN_NAME, TESTNET_STAKING_DENOM } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { ChangeEvent, FC, useEffect, useState } from "react";

interface ProfileRegistrationProps {
  did: string;
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
    setBalance(Number((BigInt(coin.amount) * 1000000n) / 1000000n) / 1000000);
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
      <VisuallyHidden>
        <Heading as="h1">Get started</Heading>
      </VisuallyHidden>
      {balance < 1 ? (
        <VStack spacing="2em">
          <Heading as="h2" color="brand.900">
            Get CORE tokens to begin
          </Heading>
          <Flex as="ol" direction="column" gap="0.5em">
            <VStack as="li" spacing="1em" layerStyle="cardBox" px="1.5em">
              <Text color="brand.900">1. Copy your wallet address:</Text>
              {chainContext.address && (
                <>
                  <Button
                    variant="empty"
                    size="sm"
                    color="text.900"
                    wordBreak="break-word"
                    whiteSpace="normal"
                    aria-label="Copy wallet address."
                    onClick={() => {
                      navigator.clipboard.writeText(chainContext.address!);
                      successToast("Wallet copied to clipboard");
                    }}
                  >
                    {chainContext.address}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    wordBreak="break-word"
                    whiteSpace="normal"
                    leftIcon={<CopyIcon mr="0.5em" />}
                    onClick={() => {
                      navigator.clipboard.writeText(chainContext.address!);
                      successToast("Wallet copied to clipboard");
                    }}
                  >
                    Copy
                  </Button>
                </>
              )}
            </VStack>
            <Box as="li" layerStyle="cardBox">
              <Text color="brand.900" textAlign="center">
                2. Go to{" "}
                <Link
                  href="https://docs.coreum.dev/docs/tools/faucet"
                  isExternal
                  color="brand.500"
                  textDecoration="underline"
                >
                  Coreum Faucet
                </Link>{" "}
                and click{" "}
                <Text as="span" fontWeight="700">
                  Testnet
                </Text>
                .
              </Text>
            </Box>
            <Box as="li" layerStyle="cardBox">
              <Text color="brand.900" textAlign="center">
                3. Paste your wallet address into the input field and click{" "}
                <Text as="span" fontWeight="700">
                  Request Fund
                </Text>
                .
              </Text>
            </Box>
            <Box as="li" layerStyle="cardBox">
              <Text color="brand.900" textAlign="center">
                4. Come back to this page and refresh if nothing has changed.
              </Text>
            </Box>
          </Flex>
        </VStack>
      ) : (
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
              {did}
            </Text>
          </Heading>
          <FormControl>
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
          </FormControl>
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
        </VStack>
      )}
    </HStack>
  );
};
