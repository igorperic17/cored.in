import { VStack } from "@chakra-ui/layout";
import { Post } from "./Post";

export const Feed = () => {
  return (
    <VStack spacing="1em">
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
    </VStack>
  );
};
