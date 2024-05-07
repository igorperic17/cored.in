import { useWrappedClientContext } from "@/contexts/client";
import { IClientContext, useLoggedInServerState } from "@/hooks";
import { USER_QUERIES } from "@/queries";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  Text,
  VStack,
  VisuallyHidden
} from "@chakra-ui/react";
import { UserProfile } from "@coredin/shared";
import { ChangeEvent, FC } from "react";

interface ProfileRegistrationProps {
  did: string;
  handleChangeUserName: (e: ChangeEvent<HTMLInputElement>) => void;
  usernameInput?: string;
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
            placeholder="Enter a username"
            onChange={handleChangeUserName}
            value={usernameInput}
            focusBorderColor="brand.500"
            mb="2em"
          />
          <FormErrorMessage>
            Please enter only lowercase or uppercase letters.
          </FormErrorMessage>
          <Button onClick={registerProfile} size="md" variant="primary">
            REGISTER
          </Button>
        </FormControl>
      </VStack>
    </HStack>
  );
};
