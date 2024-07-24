import { AutoResizeTextarea } from "@/components";
import { Avatar, Button, Flex, Icon } from "@chakra-ui/react";
import { ChangeEvent, Dispatch, FC, SetStateAction } from "react";
import { NewContentProps } from "./NewPostContent";
import { FaArrowUp } from "react-icons/fa6";

export const NewReplyContent: FC<NewContentProps> = ({
  postContent,
  setPostContent,
  handlePost,
  isLoading,
  userProfile
}) => {
  return (
    <Flex
      direction="row"
      align="center"
      gap="1.125em"
      w="100%"
      h="max-content"
      layerStyle="cardBox"
      // outline="1px solid red"
      p="1.125em"
    >
      <Avatar
        name={userProfile.username}
        src={userProfile.avatarUrl}
        size="sm"
        bg="background.600"
        color={userProfile.avatarFallbackColor || "brand.500"}
      />
      <AutoResizeTextarea
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        variant="unstyled"
        border="1px solid #828178"
        borderRadius="0.5em"
        p="0.5em"
        minH="unset"
        placeholder="Add your comment"
      />
      <Button
        variant="primary"
        size="sm"
        onClick={handlePost}
        isLoading={isLoading}
        isDisabled={!postContent}
        aria-label="post"
        px="0"
      >
        <Icon as={FaArrowUp} />
      </Button>
    </Flex>
  );
};
