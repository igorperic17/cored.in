import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  VStack
} from "@chakra-ui/react";
import { PostDTO } from "@coredin/shared";
import React from "react";
import { FaComment, FaEllipsis, FaRegHeart, FaRetweet } from "react-icons/fa6";

export type PostProps = {
  post: PostDTO;
};

export const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <VStack
      as="article"
      align="start"
      spacing="1.5em"
      w="100%"
      h="max-content"
      bg="background.700"
      borderRadius="0.5em"
      //   border="1px solid red"
      p="1.5em"
    >
      <Flex align="center" gap="1em" w="100%">
        <Avatar
          name="Natalia Davtyan"
          // src="https://bit.ly/sage-adebayo"
          bg="background.600"
          color="brand.500"
        />
        <Flex direction="column">
          <Text as="span" color="text.100">
            Natalia Davtyan
          </Text>
          <Text as="span" color="text.300">
            @nataliadi
          </Text>
        </Flex>
        <IconButton
          variant="empty"
          aria-label="See menu."
          color="text.400"
          alignSelf="start"
          ml="auto"
          mt="-0.375em"
          icon={<FaEllipsis fontSize="1.5rem" />}
          size="lg"
        />
      </Flex>
      <Box>
        <Text color="text.100">{post.text}</Text>
      </Box>
      <Flex w="100%" justify="space-around">
        <Button
          variant="empty"
          aria-label="Like the post."
          size="1rem"
          color="text.400"
          leftIcon={<FaRegHeart fontSize="1.25rem" />}
        >
          27
        </Button>
        <Button
          variant="empty"
          aria-label="Add comment."
          fontSize="1rem"
          color="text.400"
          leftIcon={<FaComment fontSize="1.25rem" />}
        >
          3
        </Button>
        <Button
          variant="empty"
          aria-label="Repost."
          size="1rem"
          color="text.400"
          leftIcon={<FaRetweet fontSize="1.5rem" />}
        >
          1
        </Button>
      </Flex>
    </VStack>
  );
};
