import { Button, Text, VStack } from "@chakra-ui/react";

export const SubscribeToProfile = () => {
  return (
    <VStack
      layerStyle="cardBox"
      w="100%"
      p="1.125em"
      pb="1.75em"
      spacing="3em"
      boxShadow="0 0 15px 0px #7AF9B3"
      my={{ base: "1em", lg: "none" }}
    >
      <Text
        textStyle="lg"
        // fontSize="1.5em"
        color="text.100"
        // textTransform="uppercase"
        textAlign="center"
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
