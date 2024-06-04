import { AutoResizeTextarea } from "@/components";
import { BaseServerStateKeys } from "@/constants";
import { useMutableServerState } from "@/hooks";
import { FEED_MUTATIONS } from "@/queries/FeedMutations";
import { Avatar, Button, Flex } from "@chakra-ui/react";
import { CreatePostDTO, PostVisibility } from "@coredin/shared";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export type NewPostProps = {
  replyToPostId?: number;
};

export const NewPost: React.FC<NewPostProps> = ({ replyToPostId }) => {
  const queryClient = useQueryClient();
  const [postContent, setPostContent] = useState("");
  const { mutateAsync, isPending } = useMutableServerState(
    FEED_MUTATIONS.publish()
  );

  const handlePost = async () => {
    const post: CreatePostDTO = {
      text: postContent,
      visibility: PostVisibility.PUBLIC,
      replyToPostId
    };
    await mutateAsync({ post });
    await queryClient.invalidateQueries({
      queryKey: replyToPostId
        ? [BaseServerStateKeys.POST] // todo - handle single post refresh!
        : [BaseServerStateKeys.FEED]
    });
    setPostContent("");
  };

  return (
    <Flex
      direction="column"
      align="start"
      gap="2em"
      w="100%"
      h="max-content"
      layerStyle="cardBox"
      // outline="1px solid red"
      p="1.5em"
    >
      <Flex align="start" gap="1.5em" w="100%">
        <Avatar
          name="U N"
          // src="https://bit.ly/sage-adebayo"
          bg="background.600"
          color="brand.500"
        />
        <AutoResizeTextarea
          placeholder="Share your thoughts"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          variant="unstyled"
          border="1px solid grey"
          borderRadius="0.5em"
          p="0.5em"
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
        isLoading={isPending}
        isDisabled={!postContent}
      >
        Post
      </Button>
    </Flex>
  );
};
