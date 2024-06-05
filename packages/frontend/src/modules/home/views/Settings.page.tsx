import { AutoResizeTextarea } from "@/components";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  Text,
  VStack
} from "@chakra-ui/react";

const SettingsPage = () => {
  return (
    <VStack spacing="2.5em" layerStyle="cardBox" p="1em" mb="4em" align="start">
      <Heading as="h1" fontFamily="body">
        Edit your information
      </Heading>
      <VStack spacing="1.25em" align="start">
        <Text as="span" textStyle="lg">
          Avatar
        </Text>
        <FormControl>
          <FormLabel>Add a link to a photo</FormLabel>
          <Input
            type="text"
            border="1px solid #828178"
            focusBorderColor="brand.500"
          />
          <FormHelperText color="text.400">
            First two letters of your username will be shown in cases when there
            is no image provided.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Letters color</FormLabel>
          {/* Limit to 2 letters */}
          <Input
            type="color"
            h="40px"
            w="80px"
            p="0"
            border="none"
            value="#7AF9B3"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Color of the profile header</FormLabel>
          <Input
            type="color"
            h="40px"
            w="80px"
            p="0"
            border="none"
            value="#7AF9B3"
          />
        </FormControl>
      </VStack>
      {/* <FormControl>
        <FormLabel fontSize={{ base: "1.25rem", lg: "1.5rem" }}>
          Username
        </FormLabel>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            color="text.400"
            // fontSize="1.2em"
          >
            @
          </InputLeftElement>
          <Input
            type="text"
            placeholder="username"
            textAlign="start"
            border="1px solid #828178"
            focusBorderColor="brand.500"
          />
        </InputGroup>
        <FormHelperText color="text.400">
          Enter only letters and numbers. Maximum length: 16 characters
        </FormHelperText>
      </FormControl> */}
      <FormControl>
        <FormLabel fontSize={{ base: "1.25rem", lg: "1.5rem" }}>Bio</FormLabel>
        <AutoResizeTextarea
          placeholder="Tell about yourself"
          minH="80px"
          border="1px solid #828178"
          focusBorderColor="brand.500"
        />
        <FormHelperText color="text.400">
          Maximum length: 250 characters
        </FormHelperText>
      </FormControl>
    </VStack>
  );
};

export default SettingsPage;
