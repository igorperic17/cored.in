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
  VStack
} from "@chakra-ui/react";
import { useState } from "react";

export const SubscriptionSettings = () => {
  const [subscriptionSettings, setSubscriptionSettings] = useState({
    price: 10,
    durationDays: 7
  });

  console.log(subscriptionSettings);

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
                  price: Number(e.target.value)
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
        // onClick={handleSubmit}
        // isLoading={isPending}
      >
        Save
      </Button>
    </VStack>
  );
};
