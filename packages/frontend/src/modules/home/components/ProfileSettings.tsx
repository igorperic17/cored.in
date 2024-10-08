import { AutoResizeTextarea, MultiSelect } from "@/components";
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
  Heading,
  Text,
  useTheme,
  Input,
  Link,
  Flex
} from "@chakra-ui/react";
import {
  SkillTags,
  TESTNET_CHAIN_NAME,
  UpdateProfileDTO
} from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { useEffect, useState } from "react";

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

  return (
    <Flex direction="column" gap="2.5em">
      <Heading as="h2" fontFamily="body">
        Your information
      </Heading>
      <Flex direction="column" gap="1.25em">
        <Text as="span" textStyle="lg" fontWeight="700">
          Avatar
        </Text>
        <FormControl>
          <FormLabel>Add a link to a photo</FormLabel>
          <Input
            type="text"
            placeholder="https://somewebsite.com/avatar.jpg"
            w="100%"
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
            borderRadius="0"
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
            borderRadius="0"
            onChange={(e) =>
              setSettings({ ...settings, backgroundColor: e.target.value })
            }
            value={settings.backgroundColor}
          />
        </FormControl>
      </Flex>
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
        <FormLabel
          fontSize={{ base: "1.25rem", lg: "1.5rem" }}
          fontWeight="700"
        >
          Skills
        </FormLabel>
        <MultiSelect
          options={[...SkillTags]}
          value={settings.skillTags || []}
          onChange={(newSkills) =>
            setSettings({
              ...settings,
              skillTags: newSkills
                ? newSkills.map((skill: any) => skill.value)
                : []
            })
          }
          placeholder="Select skills"
        />
        <FormHelperText color="text.700">
          If you don't see the skill you want to add, please suggest one to us
          on{" "}
          <Link
            href="https://discord.gg/fhsyaEJ5VZ"
            isExternal
            textDecoration="underline"
          >
            Discord
          </Link>
          .
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
    </Flex>
  );
};
