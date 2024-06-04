import { Flex, Box, Text } from "@chakra-ui/layout";
import React from "react";
import { PostDTO } from "@coredin/shared";
import { ROUTES } from "@/router/routes";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { Avatar, Button, IconButton, useTheme } from "@chakra-ui/react";
import {
  FaEllipsis,
  FaTrash,
  FaRegHeart,
  FaComment,
  FaRetweet,
  FaEye
} from "react-icons/fa6";
import { Link as ReactRouterLink } from "react-router-dom";

export type PostContentProps = {
  post: PostDTO;
  opened: boolean;
  isLiked: boolean;
  isDetailLoading: boolean;
  handleComment: () => void;
  handleLike: () => void;
  handleDelete: () => void;
  isLiking: boolean;
  isDeleting: boolean;
};

export const PostContent: React.FC<PostContentProps> = ({
  post,
  opened,
  isLiked,
  isDetailLoading,
  handleComment,
  handleDelete,
  handleLike,
  isDeleting,
  isLiking
}) => {
  const theme = useTheme();

  return (
    <>
      <Flex
        align="center"
        gap="1em"
        w="100%"
        // border="1px solid red"
      >
        <Avatar
          name="U N"
          // src="https://bit.ly/sage-adebayo"
          bg="background.600"
          color="brand.500"
        />
        <Box
          maxW="50%"
          textOverflow={"ellipsis"}
          whiteSpace="nowrap"
          overflow="hidden"
        >
          <Text as="span" color="text.100">
            @username
            {/* {post.creatorWallet} */}
          </Text>
        </Box>
        <Menu offset={[-105, -10]}>
          <MenuButton
            as={IconButton}
            variant="empty"
            color="text.400"
            aria-label="See menu."
            icon={<FaEllipsis fontSize="1.5rem" />}
            size="lg"
            isLoading={isDeleting}
            ml="auto"
          />
          <MenuList>
            <MenuItem
              onClick={handleDelete}
              // border="1px solid red"
              icon={<FaTrash color="red" />}
            >
              <Text as="span" color="red">
                Delete
              </Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Box>
        <Text color="text.100">{post.text}</Text>
      </Box>
      <Flex w="100%" justify="space-around">
        <Button
          variant="empty"
          aria-label="Add comment."
          fontSize="1rem"
          color={opened ? theme.colors.brand["500"] : "text.400"}
          leftIcon={<FaComment fontSize="1.25rem" />}
          onClick={handleComment}
          isLoading={isDetailLoading}
        />
        <Button
          as={ReactRouterLink}
          to={ROUTES.USER.POST.buildPath(post.creatorWallet, post.id)}
          variant="empty"
          aria-label="Add comment."
          fontSize="1rem"
          color={"text.400"}
          leftIcon={<FaEye fontSize="1.25rem" />}
        />
        <Button
          variant="empty"
          aria-label="Repost."
          size="1rem"
          color="text.400"
          leftIcon={<FaRetweet fontSize="1.5rem" />}
        />
        <Button
          variant="empty"
          aria-label="Like the post."
          size="1rem"
          color={isLiked ? theme.colors.brand["500"] : "text.400"}
          // color={"text.400"}
          leftIcon={<FaRegHeart fontSize="1.25rem" />}
          onClick={handleLike}
          isLoading={isLiking}
        >
          {post.likes}
        </Button>
      </Flex>
    </>
  );
};