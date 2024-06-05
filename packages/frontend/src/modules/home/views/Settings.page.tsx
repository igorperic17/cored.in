import { AutoResizeTextarea } from "@/components";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack
} from "@chakra-ui/react";
import { UserHeader } from "../components";

const SettingsPage = () => {
  return (
    <VStack spacing="1.5em" layerStyle="cardBox" p="1em" pb="4em" align="start">
      <Heading as="h1" fontFamily="body">
        Edit your information
      </Heading>
      <Text as="span">Avatar</Text>
      <FormControl>
        <FormLabel>Add a link to a photo</FormLabel>
        <Input type="text" />
      </FormControl>
      <FormControl>
        <FormLabel>Initials color</FormLabel>
        {/* Limit to 2 letters */}
        <Input type="color" h="40px" w="80px" p="0" border="none" />
      </FormControl>
      <FormControl>
        <FormLabel>Color of the profile header</FormLabel>
        <Input type="color" h="40px" w="80px" p="0" border="none" />
      </FormControl>
      {/* <FormControl>
        <FormLabel>Username</FormLabel>
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
        <FormLabel>Bio</FormLabel>
        <AutoResizeTextarea
          placeholder="Tell about yourself"
          minH="80px"
          border="1px solid #828178"
        />
        <FormHelperText color="text.400">
          Maximum length: 250 characters
        </FormHelperText>
      </FormControl>
    </VStack>
  );
};

export default SettingsPage;
