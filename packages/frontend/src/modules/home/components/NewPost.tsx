import { useMutableServerState } from "@/hooks";
import { FEED_MUTATIONS } from "@/queries/FeedMutations";
import { Avatar, Button, Flex, Text, Textarea, VStack } from "@chakra-ui/react";
import { CreatePostDTO, PostVisibility } from "@coredin/shared";
import { useState } from "react";

export const NewPost = () => {
  const [postContent, setPostContent] = useState("");
  const { mutate } = useMutableServerState(FEED_MUTATIONS.publish());

  const handlePost = () => {
    const post: CreatePostDTO = {
      text: postContent,
      visibility: PostVisibility.PUBLIC
    };
    mutate({ post });
  };

  return (
    <VStack
      align="start"
      spacing="2em"
      w="100%"
      maxW="450px"
      h="max-content"
      bg="background.800"
      borderRadius="0.5em"
      //   border="1px solid red"
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
        placeholder="Share your thoughts"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
      />
      <Button variant="primary" size="md" alignSelf="end" onClick={handlePost}>
        Post
      </Button>
    </VStack>
  );
};
