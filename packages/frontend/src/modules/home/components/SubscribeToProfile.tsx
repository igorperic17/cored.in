import { Button, Text, VStack } from "@chakra-ui/react";

export const SubscribeToProfile = () => {
  return (
    <VStack
      layerStyle="cardBox"
      bg="background.700"
      w="100%"
      p="1.125em"
      pb="1.75em"
      spacing="3em"
    >
      <Text
        textStyle="lg"
        // fontSize="1.5em"
        color="brand.500"
        // textTransform="uppercase"
      >
        Subscribe to this user's profile to see their private information and
        send messages.
      </Text>
      <Button variant="primary" size="md" w="100%" alignSelf="end">
        Subscribe
      </Button>
    </VStack>
  );
};
