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
      spacing="2em"
      w="100%"
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
        <IconButton
          variant="empty"
          aria-label="See menu."
          color="inherit"
          alignSelf="start"
          // border="1px solid red"
          ml="auto"
          mt="-0.375em"
          icon={<FaEllipsis />}
        />
      </Flex>
      <Box>
        <Text>{post.text}</Text>
      </Box>
      <Flex w="100%" justify="space-around">
        <Button
          variant="empty"
          size="xs"
          color="text.100"
          leftIcon={<FaRegHeart />}
        >
          Like
        </Button>
        <Button
          variant="empty"
          size="xs"
          color="text.100"
          leftIcon={<FaComment />}
        >
          Comment
        </Button>
        <Button
          variant="empty"
          size="xs"
          color="text.100"
          leftIcon={<FaRetweet />}
        >
          Share
        </Button>
      </Flex>
    </VStack>
  );
};
