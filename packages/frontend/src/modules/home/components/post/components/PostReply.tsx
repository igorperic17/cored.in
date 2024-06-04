import { AutoResizeTextarea } from "@/components";
import { Avatar, Button, Flex } from "@chakra-ui/react";
import { FC, useState } from "react";
import { BaseServerStateKeys } from "@/constants";
import { useQueryClient } from "@tanstack/react-query";
import { useMutableServerState } from "@/hooks";
import { FEED_MUTATIONS } from "@/queries/FeedMutations";
import { CreatePostDTO, PostVisibility } from "@coredin/shared";
import { NewPostProps as NewReplyProps } from "../../NewPost";

export const PostReply: FC<NewReplyProps> = ({ replyToPostId }) => {
  const queryClient = useQueryClient();
  const [replyContent, setReplyContent] = useState("");
  const { mutateAsync, isPending } = useMutableServerState(
    FEED_MUTATIONS.publish()
  );

  const handleReply = async () => {
    const post: CreatePostDTO = {
      text: replyContent,
      visibility: PostVisibility.PUBLIC,
      replyToPostId
    };
    await mutateAsync({ post });
    await queryClient.invalidateQueries({
      queryKey: replyToPostId
        ? [BaseServerStateKeys.POST] // todo - handle single post refresh!
        : [BaseServerStateKeys.FEED]
    });
    setReplyContent("");
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
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          border="none"
          borderRadius="0"
          borderBottom="2px solid"
          borderBottomColor="background.400"
          variant="unstyled"
        />
      </Flex>
      <Button
        variant="primary"
        size="md"
        alignSelf="end"
        onClick={handleReply}
        isLoading={isPending}
      >
        Post
      </Button>
    </Flex>
  );
};
