import { FC, useRef } from "react";
import { PostDTO, PostVisibility } from "@coredin/shared";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Button,
  Flex,
  HStack,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tag,
  Text,
  VStack,
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

export const Content: FC<PostContentProps> = ({
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

  const postUrl = ROUTES.USER.POST.buildPath(post.creatorWallet, post.id);

  return (
    <Flex
      direction="column"
      gap={{ base: "0.75em", sm: "1.125em" }}
      w="100%"
      align="start"
      // border="1px solid red"
    >
      <Flex
        justify="space-between"
        w="100%"
        gap={{ base: "0.75em", sm: "1.125em" }}
        // border="1px solid red"
        //
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
          alignItems="left"
          justify="space-between"
          spacing="0em"
          w="100%"
          // border="1px solid red"
        >
          <Link
            as={ReactRouterLink}
            to={ROUTES.USER.buildPath(post.creatorWallet)}
            _hover={{ textDecoration: "none" }}
          >
            <Text
              color="brand.900"
              textStyle="md"
              lineHeight="1em"
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
              // border="1px solid red"
            >
              {post.creatorUsername}
            </Text>
          </Link>
          {/* TODO: to add dateTime later */}
          <Link
            as={ReactRouterLink}
            to={ROUTES.USER.POST.buildPath(post.creatorWallet, post.id)}
            _hover={{ textDecoration: "none" }}
            aria-label="Open the post."
            // border="1px solid red"
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
              <MenuItem onClick={onOpen} icon={<FaTrash color="red" />}>
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

      {post.skillTags.length > 0 && (
        <Link
          as={ReactRouterLink}
          to={ROUTES.USER.POST.buildPath(post.creatorWallet, post.id)}
          _hover={{ textDecoration: "none" }}
          w="100%"
          aria-label="Open the post."
        >
          <Flex gap="0.5em" flexWrap="wrap">
            {post.skillTags.map((skill) => (
              <Tag key={skill} variant="primary" size="md">
                {skill}
              </Tag>
            ))}
          </Flex>
        </Link>
      )}

      <Link
        as={ReactRouterLink}
        to={postUrl}
        _hover={{ textDecoration: "none" }}
        w="100%"
        aria-label="Open the post."
      >
        <Text
          color="brand.900"
          textStyle="sm"
          wordBreak="break-word"
          whiteSpace="pre-wrap"
        >
          {post.text}
        </Text>
      </Link>

      <ActionBar
        post={post}
        opened={opened}
        isLiked={isLiked}
        isLiking={isLiking}
        isDetailLoading={isDetailLoading}
        handleComment={handleComment}
        handleLike={handleLike}
        handleTip={handleTip}
        postUrl={postUrl}
      />
    </Flex>
  );
};
