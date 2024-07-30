import { CoredinClientContext } from "@/contexts/CoredinClientContext";
import { useContractRead } from "@/hooks";
import { CONTRACT_QUERIES } from "@/queries";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  Select,
  VStack,
  Box,
  useToast
} from "@chakra-ui/react";
import { TESTNET_CHAIN_NAME, TESTNET_STAKING_DENOM } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { useContext, useEffect, useState } from "react";

export const SubscriptionSettings = () => {
  const coredinClient = useContext(CoredinClientContext);
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const toast = useToast();
  const { data: profileDid } = useContractRead(
    CONTRACT_QUERIES.getWalletDid(coredinClient!, chainContext.address || ""),
    { enabled: !!coredinClient && !!chainContext.address }
  );
  const { data: subscriptionPrice } = useContractRead(
    CONTRACT_QUERIES.getSubscriptionPrice(
      coredinClient!,
      profileDid?.did_info?.did || ""
    ),
    { enabled: !!coredinClient && !!profileDid?.did_info?.did }
  );
  const { data: subscriptionDays } = useContractRead(
    CONTRACT_QUERIES.getSubscriptionDuration(
      coredinClient!,
      profileDid?.did_info?.did || ""
    ),
    { enabled: !!coredinClient && !!profileDid?.did_info?.did }
  );
  const [subscriptionSettings, setSubscriptionSettings] = useState({
    price: "10",
    durationDays: 7
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (subscriptionPrice) {
      console.log(
        "Setting subscription price from chain value",
        subscriptionPrice
      );
      setSubscriptionSettings((prev) => ({
        price: subscriptionPrice?.amount,
        durationDays: prev.durationDays
      }));
    }
  }, [subscriptionPrice]);

  useEffect(() => {
    if (subscriptionDays) {
      setSubscriptionSettings((prev) => ({
        price: prev.price,
        durationDays: parseInt(subscriptionDays)
      }));
    }
  }, [subscriptionDays]);

  const handleSubmit = () => {
    console.log(
      "Updating onchain subscription settings... to",
      subscriptionSettings
    );
    if (coredinClient) {
      setIsUpdating(true);
      coredinClient
        .setSubscription({
          price: {
            amount: subscriptionSettings.price,
            denom: TESTNET_STAKING_DENOM
          },
          duration: subscriptionSettings.durationDays.toString()
        })
        .then(() => {
          toast({
            position: "top-right",
            status: "success",
            duration: 3000,
            render: () => (
              <Box
                color="text.900"
                p="1em 1.5em"
                bg="brand.500"
                borderRadius="0.5em"
              >
                Updated onchain subscription settings successfully
              </Box>
            ),
            isClosable: true
          });
        })
        .catch((error) => {
          console.error(
            "Error subscribing to",
            profileDid?.did_info?.did,
            error
          );
          toast({
            position: "top-right",
            status: "error",
            duration: 3000,
            render: () => (
              <Box
                color="text.900"
                p="1em 1.5em"
                bg="red.500"
                borderRadius="0.5em"
              >
                Error updating onchain subscription settings
              </Box>
            ),
            isClosable: true
          });
        })
        .finally(() => {
          setIsUpdating(false);
        });
    }
  };

  return (
    <VStack
      spacing="2.5em"
      layerStyle="cardBox"
      px="1em"
      py="1.5em"
      align="start"
      mb="4em"
    >
      <Heading as="h2" fontFamily="body">
        Your subscription details
      </Heading>
      <VStack spacing="1.25em" align="start" w="100%">
        <FormControl>
          <FormLabel>Set the price of the subscription</FormLabel>
          <InputGroup>
            <Input
              type="number"
              min="0"
              border="1px solid #828178"
              focusBorderColor="brand.500"
              placeholder="5.50"
              w="120px"
              onChange={(e) =>
                setSubscriptionSettings({
                  ...subscriptionSettings,
                  price: e.target.value
                })
              }
              value={subscriptionSettings.price}
            />
            <InputRightAddon
              color="text.900"
              bg="background.400"
              border="1px solid #828178"
            >
              CORE
            </InputRightAddon>
          </InputGroup>
          <FormHelperText color="text.400">
            This is the price that users will be charged when subscribing to
            your profile. If you wish the subscription to be free, set the price
            to 0.
          </FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Duration</FormLabel>
          <Select
            border="1px solid #828178"
            focusBorderColor="brand.500"
            value={subscriptionSettings.durationDays}
            onChange={(e) =>
              setSubscriptionSettings({
                ...subscriptionSettings,
                durationDays: Number(e.target.value)
              })
            }
          >
            <option value="1">1 day</option>
            <option value="7">1 week</option>
            <option value="14">2 weeks</option>
            <option value="21">3 weeks</option>
            <option value="30">1 month</option>
            <option value="60">2 months</option>
            <option value="90">3 months</option>
          </Select>
          <FormHelperText color="text.400">
            This is the duration that users will be subscribed to your profile.
            After this period they will need to renew the subscription in order
            to get access to the subscription features again. 1 month equals to
            30 days.
          </FormHelperText>
        </FormControl>
      </VStack>

      <Text textStyle="sm">
        Please note, these changes will not affect your current subscribers.
      </Text>

      <Button
        variant="primary"
        size="md"
        w="100%"
        onClick={handleSubmit}
        isLoading={isUpdating}
      >
        Save
      </Button>
    </VStack>
  );
};
