import { Flex, Text, VStack, Link, HStack } from "@chakra-ui/layout";
import React, { useRef } from "react";
import { PostDTO, PostVisibility } from "@coredin/shared";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Button,
  IconButton,
  useDisclosure
} from "@chakra-ui/react";
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
  handleTip: () => void;
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
  handleLike,
  handleTip
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  return (
    <>
      <Flex
        gap={{ base: "0.75em", sm: "1.125em" }}
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
            bg="brand.100"
            color={post.creatorAvatarFallbackColor || "brand.500"}
            border={post.creatorAvatar || "1px solid #b0b0b0"}
            size={{ base: "sm", sm: "md" }}
            // boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)" // Added horizontal shadow
          />
        </Link>
        <VStack
          align="start"
          spacing="1em"
          w="100%"
          // border="1px solid yellow"
        >
          <Flex justify="space-between" w="100%">
            <VStack alignItems="left" spacing="0em">
              <Link
                as={ReactRouterLink}
                to={ROUTES.USER.buildPath(post.creatorWallet)}
              >
                <Text
                  color="brand.900"
                  textStyle="md"
                  maxW={{
                    base: "14ch",
                    sm: "24ch",
                    md: "36ch",
                    lg: "28ch",
                    xl: "32ch"
                  }}
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                >
                  {post.creatorUsername}
                </Text>
              </Link>
              {/* TODO: to add dateTime later */}
              <Link
                as={ReactRouterLink}
                to={ROUTES.USER.POST.buildPath(post.creatorWallet, post.id)}
              >
                <Text
                  as="time"
                  dateTime=""
                  color="text.700"
                  textStyle="xs"
                  userSelect="none"
                >
                  {new Date(post.createdAt).toLocaleDateString()}
                  <Text as="span" fontSize="0.75em" whiteSpace="pre-wrap">
                    {"  •  "}
                  </Text>
                  {new Date(post.createdAt).toLocaleTimeString()}
                </Text>
              </Link>
            </VStack>

            {/* ! */}
            {post.visibility === PostVisibility.RECIPIENTS && (
              <HStack>
                <Text as="span" color="text.700" textStyle="sm">
                  {`Recipient: ${post.recipients?.map((recipient) => recipient.username).join(", ")}`}
                </Text>
                {post.recipients?.map((recipient) => (
                  <Avatar
                    key={recipient.wallet}
                    name={recipient.username}
                    src={recipient.avatarUrl}
                    bg="brand.100"
                    color={recipient.avatarFallbackColor || "brand.500"}
                    border={recipient.avatarUrl || "1px solid #b0b0b0"}
                    size={{ base: "sm", sm: "md" }}
                    // boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)" // Added horizontal shadow
                  />
                ))}
              </HStack>
            )}
            {showOptions && (
              <Menu offset={[-105, -10]}>
                <MenuButton
                  as={IconButton}
                  variant="empty"
                  color="text.700"
                  aria-label="See menu."
                  icon={<FaEllipsis fontSize="1.5rem" />}
                  size="lg"
                  isLoading={isDeleting}
                  ml="auto"
                  mt="-0.5em"
                />
                <MenuList>
                  <MenuItem
                    onClick={onOpen}
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
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
              motionPreset="slideInBottom"
              isCentered
              closeOnEsc
              closeOnOverlayClick
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader
                    fontSize={{ base: "1.25rem", lg: "1.5rem" }}
                    fontWeight="700"
                    textTransform="uppercase"
                  >
                    Delete post
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    <Text>
                      Are you sure? You can't undo this action afterwards.
                    </Text>
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button
                      ref={cancelRef}
                      onClick={onClose}
                      variant="empty"
                      color="text.700"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      bg="brand.400"
                      onClick={handleDelete}
                      ml="1.5em"
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Flex>
          <Text color="brand.900" textStyle="sm" wordBreak="break-word">
            {post.text}
          </Text>

          <ActionBar
            post={post}
            opened={opened}
            isLiked={isLiked}
            isLiking={isLiking}
            isDetailLoading={isDetailLoading}
            handleComment={handleComment}
            handleLike={handleLike}
            handleTip={handleTip}
          />
        </VStack>
      </Flex>
    </>
  );
};
