import { BaseServerStateKeys } from "@/constants";
import { useMutableServerState } from "@/hooks";
import { FEED_MUTATIONS } from "@/queries/FeedMutations";
import { Avatar, Button, Flex, Text, Textarea, VStack } from "@chakra-ui/react";
import { CreatePostDTO, PostVisibility } from "@coredin/shared";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const NewPost = () => {
  const queryClient = useQueryClient();
  const [postContent, setPostContent] = useState("");
  const { mutateAsync, isPending } = useMutableServerState(
    FEED_MUTATIONS.publish()
  );

  const handlePost = async () => {
    const post: CreatePostDTO = {
      text: postContent,
      visibility: PostVisibility.PUBLIC
    };
    await mutateAsync({ post });
    await queryClient.invalidateQueries({
      queryKey: [BaseServerStateKeys.FEED]
    });
  };

  return (
    <VStack
      align="start"
      spacing="2em"
      w="100%"
      h="max-content"
      bg="background.800"
      borderRadius="0.5em"
      // outline="1px solid red"
      p="1.5em"
    >
      <Flex align="center" gap="1em" w="100%">
        <Avatar
          name="Natalia Davtyan"
          // src="https://bit.ly/sage-adebayo"
          bg="brand.500"
          color="text.900"
        />
        <Flex direction="column">
          <Text as="span">Natalia Davtyan</Text>
          <Text as="span">@nataliadi</Text>
        </Flex>
      </Flex>
      <Textarea
        // w="100%"
        placeholder="Share your thoughts"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
      />
      <Button
        variant="primary"
        size="md"
        alignSelf="end"
        onClick={handlePost}
        isLoading={isPending}
      >
        Post
      </Button>
    </VStack>
  );
};
