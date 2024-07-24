import { Flex, Box, Text, VStack, Link } from "@chakra-ui/layout";
import React from "react";
import { PostDTO } from "@coredin/shared";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { Avatar, IconButton } from "@chakra-ui/react";
import { FaEllipsis, FaTrash } from "react-icons/fa6";
import { ActionBar } from "./ActionBar";
import { Link as ReactRouterLink } from "react-router-dom";
import { ROUTES } from "@/router/routes";

export type PostContentProps = {
  post: PostDTO;
  handleDelete?: () => void;
  isDeleting?: boolean;
  opened: boolean;
  isLiked: boolean;
  isLiking: boolean;
  isDetailLoading: boolean;
  showOptions: boolean;
  handleComment: () => void;
  handleLike: () => void;
};

export const Content: React.FC<PostContentProps> = ({
  post,
  handleDelete,
  isDeleting,
  opened,
  isLiked,
  isLiking,
  isDetailLoading,
  showOptions,
  handleComment,
  handleLike
}) => {
  return (
    <>
      <Flex
        // align="center"
        gap="1.125em"
        w="100%"
        // border="1px solid red"
      >
        <Link
          as={ReactRouterLink}
          to={ROUTES.USER.buildPath(post.creatorWallet)}
        >
          <Avatar
            name={post.creatorUsername}
            src={post.creatorAvatar}
            bg="background.600"
            color="brand.500"
            size="md"
          />
        </Link>
        <VStack
          align="start"
          spacing="0.5em"
          w="100%"
          // border="1px solid yellow"
        >
          <Flex justify="space-between" w="100%">
            <Link
              as={ReactRouterLink}
              to={ROUTES.USER.buildPath(post.creatorWallet)}
            >
              <Box
                maxW={{ base: "190px" }}
                textOverflow={"ellipsis"}
                whiteSpace="nowrap"
                overflow="hidden"
              >
                {/* recommended username width 12 characters */}
                <Text as="span" color="text.100" textStyle="md">
                  @{post.creatorUsername}
                </Text>
              </Box>
            </Link>
            {showOptions && (
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
                  mt="-0.5em"
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
            )}
          </Flex>
          <Text color="text.100" textStyle="sm" wordBreak="break-word">
            {post.text}
          </Text>
          {/* to add dateTime later */}
          <Text as="time" dateTime="" color="text.400" textStyle="sm">
            {new Date(post.createdAt).toLocaleTimeString()}
            <Text as="span" fontSize="0.75em" whiteSpace="pre-wrap">
              {"    •    "}
            </Text>
            {new Date(post.createdAt).toLocaleDateString()}
          </Text>
          <ActionBar
            post={post}
            opened={opened}
            isLiked={isLiked}
            isLiking={isLiking}
            isDetailLoading={isDetailLoading}
            handleComment={handleComment}
            handleLike={handleLike}
          />
        </VStack>
      </Flex>
    </>
  );
};
