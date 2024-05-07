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
      Please note that cored.in is currently in development, so any information
      provided by you will be immediately deleted and no registrations will be
      made. Please come back when cored.in is ready and create a new profile.
    </Text>
  );
};
