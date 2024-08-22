import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Text,
  VStack,
  VisuallyHidden
} from "@chakra-ui/react";
import { ChangeEvent, FC } from "react";

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
        <FormControl as="form">
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
          <Button
            mt="2em"
            isDisabled={usernameInput.length < 3}
            onClick={registerProfile}
            size="md"
            variant="primary"
            isLoading={isRegistering}
          >
            REGISTER
          </Button>
        </FormControl>
      </VStack>
    </HStack>
  );
};
