import { AutoResizeTextarea } from "@/components";
import {
  useCustomToast,
  useLoggedInServerState,
  useMutableServerState
} from "@/hooks";
import { USER_MUTATIONS, USER_QUERIES } from "@/queries";
import { formElementBorderStyles } from "@/themes";
import {
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  VStack,
  Heading,
  Text,
  useTheme,
  Input
} from "@chakra-ui/react";
import {
  SkillTags,
  TESTNET_CHAIN_NAME,
  UpdateProfileDTO
} from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { useEffect, useState } from "react";
import { Select } from "chakra-react-select";

export const ProfileSettings = () => {
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const { data: userProfile, isLoading } = useLoggedInServerState(
    USER_QUERIES.getUser(chainContext.address || ""),
    {
      enabled: !!chainContext.address
    }
  );
  const [settings, setSettings] = useState<UpdateProfileDTO>({
    avatarUrl: userProfile?.avatarUrl || "",
    avatarFallbackColor: userProfile?.avatarFallbackColor || "#7F02FE",
    backgroundColor: userProfile?.backgroundColor || "#FBB030",
    bio: userProfile?.bio || "",
    skillTags: userProfile?.skillTags || []
  });

  useEffect(() => {
    setSettings({
      avatarUrl: userProfile?.avatarUrl || "",
      avatarFallbackColor: userProfile?.avatarFallbackColor || "#7F02FE",
      backgroundColor: userProfile?.backgroundColor || "#FBB030",
      bio: userProfile?.bio || "",
      skillTags: userProfile?.skillTags || []
    });
  }, [userProfile]);

  const { mutateAsync, isPending } = useMutableServerState(
    USER_MUTATIONS.updateProfile()
  );
  const theme = useTheme();
  const { successToast } = useCustomToast();

  const handleSubmit = () => {
    mutateAsync({ profile: settings }).then(() => {
      successToast("Saved successfully");
    });
  };

  console.log("skills", settings.skillTags);

  return (
    <VStack spacing="2.5em" align="start">
      <Heading as="h2" fontFamily="body">
        Your information
      </Heading>
      <VStack spacing="1.25em" align="start">
        <Text as="span" textStyle="lg" fontWeight="700">
          Avatar
        </Text>
        <FormControl>
          <FormLabel>Add a link to a photo</FormLabel>
          <Input
            type="text"
            placeholder="https://somewebsite.com/avatar.jpg"
            {...formElementBorderStyles}
            onChange={(e) =>
              setSettings({ ...settings, avatarUrl: e.target.value || "" })
            }
            value={settings.avatarUrl}
          />
          <FormHelperText color="text.700">
            First letter of your username will be shown in cases when there is
            no image provided.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Letters color</FormLabel>
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
              color="brand.900"
              bg="text.300"
              border="1px solid #141413"
            >
              @
            </InputLeftElement>
            <Input
              type="text"
              placeholder="username"
              textAlign="start"
              {...formElementBorderStyles}
            />
          </InputGroup>
          <FormHelperText color="text.700">
            Enter only letters and numbers. Maximum length: 16 characters
          </FormHelperText>
        </FormControl> */}
      <FormControl>
        <FormLabel
          fontSize={{ base: "1.25rem", lg: "1.5rem" }}
          fontWeight="700"
        >
          Bio
        </FormLabel>
        <AutoResizeTextarea
          placeholder="Add short bio about yourself"
          minH="80px"
          maxLength={250}
          onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
          value={settings.bio}
        />
        <FormHelperText color="text.700">
          Maximum length: 250 characters
        </FormHelperText>
      </FormControl>
      <FormControl>
        <FormLabel>Skills</FormLabel>
        <Select
          {...formElementBorderStyles}
          menuPlacement="auto"
          options={SkillTags.map((tag) => ({ label: tag, value: tag }))}
          value={settings.skillTags?.map((tag) => ({ label: tag, value: tag }))}
          isMulti
          onChange={(newSkills) =>
            setSettings({
              ...settings,
              skillTags: newSkills ? newSkills.map((skill) => skill.value) : []
            })
          }
          // chakraStyles={{
          //   menuList: (provided) => ({
          //     ...provided,
          //     minHeight: "350px"
          //   })
          // }}
        />
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
