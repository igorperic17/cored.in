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
}

export const NotRegisteredProfile: FC<ProfileRegistrationProps> = ({
  did,
  handleChangeUserName,
  usernameInput,
  registerProfile
}) => {
  return (
    <HStack
      w="100%"
      maxW="1200px"
      minH="50vh"
      background="background.800"
      mx="auto"
      mt="52px"
      px="2em"
      py="2em"
      borderRadius="16px"
      justify="center"
      textAlign="center"
    >
      <VStack spacing="8em" maxW="700px" mx="auto">
        <Heading
          as="h2"
          fontSize={{ base: "1rem", md: "1.25rem" }}
          color="text.700"
        >
          Here is your new DID:
          <Text
            as="span"
            display="block"
            color="text.300"
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
            focusBorderColor="brand.500"
            py="0.875em"
            textAlign="center"
            fontSize={{ base: "1.25rem", md: "1.75rem" }}
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
            _disabled={{
              cursor: "not-allowed",
              backgroundColor: "background.600"
            }}
          >
            REGISTER
          </Button>
        </FormControl>
      </VStack>
    </HStack>
  );
};
