import { AutoResizeTextarea } from "@/components";
import { useLoggedInServerState, useMutableServerState } from "@/hooks";
import { USER_MUTATIONS, USER_QUERIES } from "@/queries";
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  VStack,
  Heading,
  Text,
  useToast,
  Box,
  useMediaQuery,
  useTheme,
  CloseButton,
  HStack,
  Flex
} from "@chakra-ui/react";
import { TESTNET_CHAIN_NAME, UpdateProfileDTO } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { useState } from "react";

export const Settings = () => {
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const { data: userProfile, isLoading } = useLoggedInServerState(
    USER_QUERIES.getUser(chainContext.address || ""),
    {
      enabled: !!chainContext.address
    }
  );
  const [settings, setSettings] = useState<UpdateProfileDTO>({
    avatarUrl: userProfile?.avatarUrl || "",
    avatarFallbackColor: userProfile?.avatarFallbackColor || "#7AF9B3",
    backgroundColor: userProfile?.backgroundColor || "#7AF9B3",
    bio: userProfile?.bio || ""
  });
  const { mutateAsync, isPending } = useMutableServerState(
    USER_MUTATIONS.updateProfile()
  );
  const toast = useToast();
  const theme = useTheme();
  const [isLargerThanLg] = useMediaQuery(
    `(min-width: ${theme.breakpoints.lg})`
  );

  const handleSubmit = () => {
    mutateAsync({ profile: settings }).then(() => {
      //   alert("Profile updated");
      toast({
        position: isLargerThanLg ? "top-right" : "top-right",
        status: "success",
        duration: 1000,
        render: () => (
          <Box
            color="text.900"
            p="1em 1.5em"
            bg="brand.500"
            borderRadius="0.5em"
          >
            Saved successfully!
          </Box>
        ),
        isClosable: true
      });
    });
  };

  //   console.log(settings);
  return (
    <VStack
      spacing="2.5em"
      layerStyle="cardBox"
      p="1em"
      pb="1.5em"
      align="start"
      mb="4em"
    >
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
            placeholder="https://somewebsite.com/avatar.jpg"
            onChange={(e) =>
              setSettings({ ...settings, avatarUrl: e.target.value || "" })
            }
            value={settings.avatarUrl}
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
            onChange={(e) =>
              setSettings({ ...settings, avatarFallbackColor: e.target.value })
            }
            value={settings.avatarFallbackColor}
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
            onChange={(e) =>
              setSettings({ ...settings, backgroundColor: e.target.value })
            }
            value={settings.backgroundColor}
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
          placeholder="Add short bio about yourself"
          minH="80px"
          border="1px solid #828178"
          focusBorderColor="brand.500"
          maxLength={250}
          onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
          value={settings.bio}
        />
        <FormHelperText color="text.400">
          Maximum length: 250 characters
        </FormHelperText>
      </FormControl>
      <Button
        variant="primary"
        size="md"
        w="100%"
        onClick={handleSubmit}
        isLoading={isPending}
      >
        Save
      </Button>
    </VStack>
  );
};
