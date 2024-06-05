import { AutoResizeTextarea } from "@/components";
import { Avatar, Button, Flex } from "@chakra-ui/react";
import { ChangeEvent, Dispatch, FC, SetStateAction } from "react";

export type NewContentProps = {
  postContent: string;
  setPostContent: Dispatch<SetStateAction<string>>;
  handlePost: () => void;
  isLoading: boolean;
};

export const NewPostContent: FC<NewContentProps> = ({
  postContent,
  setPostContent,
  handlePost,
  isLoading
}) => {
  return (
    <Flex
      direction="column"
      align="start"
      gap="1.125em"
      w="100%"
      h="max-content"
      layerStyle="cardBox"
      // outline="1px solid red"
      p="1.125em"
    >
      <Flex align="start" gap="1.125em" w="100%">
        <Avatar
          name="U N"
          // src="https://bit.ly/sage-adebayo"
          size="md"
          bg="background.600"
          color="brand.500"
        />
        <AutoResizeTextarea
          placeholder="Share your thoughts"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          variant="unstyled"
          border="1px solid #828178"
          borderRadius="0.5em"
          p="0.5em"
          // textStyle="lg"
          // border="none"
          // borderRadius="0"
          // borderBottom="2px solid"
          // borderBottomColor="background.400"
        />
      </Flex>
      <Button
        variant="primary"
        size="sm"
        alignSelf="end"
        onClick={handlePost}
        isLoading={isLoading}
        isDisabled={!postContent}
      >
        Post
      </Button>
    </Flex>
  );
};
