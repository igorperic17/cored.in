import { VStack } from "@chakra-ui/layout";
import { NewPost, Post } from ".";

export const Feed = () => {
  return (
    <VStack spacing="1em">
      <NewPost />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
    </VStack>
  );
};
