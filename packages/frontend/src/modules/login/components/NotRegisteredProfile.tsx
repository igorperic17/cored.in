import { useCustomToast } from "@/hooks";
import { CopyIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  Link,
  Spinner,
  Text,
  VStack,
  VisuallyHidden
} from "@chakra-ui/react";
import { DID, TESTNET_CHAIN_NAME, TESTNET_FEE_DENOM } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { ChangeEvent, FC, useEffect, useState } from "react";

interface ProfileRegistrationProps {
  did: DID;
  handleChangeUserName: (e: ChangeEvent<HTMLInputElement>) => void;
  usernameInput: string;
  registerProfile: () => void;
  isRegistering: boolean;
  isErrorUsername: boolean;
}

export const NotRegisteredProfile: FC<ProfileRegistrationProps> = ({
  did,
  handleChangeUserName,
  usernameInput,
  registerProfile,
  isRegistering,
  isErrorUsername
}) => {
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const [balance, setBalance] = useState(0);
  const [isBalanceLoaded, setIsBalanceLoaded] = useState(false);
  const { successToast } = useCustomToast();

  const getBalance = async () => {
    if (!chainContext.address) {
      setBalance(0);
      setIsBalanceLoaded(false);
      return;
    }

    const client = await chainContext.getCosmWasmClient();
    const coin = await client.getBalance(
      chainContext.address,
      TESTNET_FEE_DENOM
    );

    // TODO - REVIEW DECIMALS AFTER TESTNET, utestcore has 6 decimals!
    setBalance(Number((BigInt(coin.amount) * 1000000n) / 1000000n) / 1000000);
    setIsBalanceLoaded(true);
  };

  useEffect(() => {
    const interval = setInterval(getBalance, 5000);

    return () => clearInterval(interval);
  }, [chainContext.address]);

  if (!isBalanceLoaded) {
    return (
      <Center mt="32px">
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

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
            Get CORE tokens to register
          </Heading>
          <Flex as="ol" direction="column" gap="0.5em">
            <VStack as="li" spacing="1em" layerStyle="cardBox" px="1.5em">
              <Text color="brand.900">1. Copy your wallet address:</Text>
              {chainContext.address && (
                <>
                  <Button
                    variant="empty"
                    size="sm"
                    color="brand.900"
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
              {did?.value}
            </Text>
          </Heading>
          <FormControl isInvalid={isErrorUsername}>
            <VisuallyHidden>
              <FormLabel as="label">Enter a username</FormLabel>
            </VisuallyHidden>
            <Input
              variant="flushed"
              placeholder="Enter username"
              onChange={handleChangeUserName}
              value={usernameInput}
              focusBorderColor="brand.300"
              errorBorderColor="brand.400"
              py="0.875em"
              textAlign="center"
              fontSize={{ base: "1.25rem", md: "1.75rem" }}
              color="brand.300"
            />
            <FormErrorMessage
              justifyContent="center"
              fontSize="1rem"
              color="brand.400"
            >
              This username already exists
            </FormErrorMessage>
            <FormHelperText fontSize="1rem" my="1em" color="other.200">
              At least 3 characters required, only letters and numbers allowed.
            </FormHelperText>
          </FormControl>

          <VStack spacing="1em">
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
            <Text color="other.600" textStyle="sm">
              Please note that you will not be able to change your username
              later
            </Text>
          </VStack>
        </VStack>
      )}
    </HStack>
  );
};
