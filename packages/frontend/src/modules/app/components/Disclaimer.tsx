import { Text } from "@chakra-ui/layout";

export const Disclaimer = () => {
  return (
    <Text
      color="text.400"
      fontSize={{ base: "0.875rem", md: "1rem" }}
      mt="auto"
      mx="auto"
      py="2em"
      px={{ base: "1em", md: "2.5em", lg: "3.5em", xl: "4em" }}
      textAlign="center"
      maxW="1100px"
    >
      Please note that cored.in is currently in active development and features
      are available for testing purposes only. All data may be deleted at any
      time without any prior notice. Please come back when cored.in is ready to
      create a persistent profile.
    </Text>
  );
};
