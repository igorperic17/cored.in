import { AutoResizeTextarea } from "@/components";
import { Avatar, Button, Flex, HStack } from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction } from "react";
import { UserProfile } from "@coredin/shared";

export type NewMessageProps = {
  postContent: string;
  setPostContent: Dispatch<SetStateAction<string>>;
  handlePost: () => void;
  isLoading: boolean;
  subscriptions: { label: string; value: string }[];
  recipients: string[];
  setRecipients: (recipients: string[]) => void;
  userProfile: UserProfile;
};

export const NewMessageContent: FC<NewMessageProps> = ({
  postContent,
  setPostContent,
  handlePost,
  isLoading,
  recipients,
  setRecipients,
  userProfile
}) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      direction="column"
      align="start"
      gap="1.125em"
      w="100%"
      h="max-content"
      layerStyle="cardBox"
      // outline="1px solid red"
      // p="1.125em"
      py="1em"
    >
      <Flex align="start" gap="1.125em" w="100%">
        <Avatar
          name={userProfile.username}
          src={userProfile.avatarUrl}
          size={{ base: "sm", sm: "md" }}
          bg="brand.100"
          color={userProfile.avatarFallbackColor || "brand.500"}
          border={userProfile.avatarUrl || "1px solid #b0b0b0"}
        />
        <AutoResizeTextarea
          placeholder="Share your thoughts"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          variant="unstyled"
          borderRadius="0.5em"
          p="0.5em"
        />
      </Flex>
      <HStack alignSelf="end" spacing="1.5em">
        <Button
          variant="primary"
          size="sm"
          alignSelf="end"
          onClick={handlePost}
          isLoading={isLoading}
          isDisabled={!postContent || recipients.length === 0}
        >
          Message
        </Button>
      </HStack>
    </Flex>
  );
};
