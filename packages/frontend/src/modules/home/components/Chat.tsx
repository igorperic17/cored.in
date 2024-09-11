import { AutoResizeTextarea } from "@/components";
import { ROUTES } from "@/router/routes";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { FC, useRef, useState } from "react";
import {
  Link as ReactRouterLink,
  useNavigate,
  useParams
} from "react-router-dom";
import { ChatMessage } from ".";
import { FaArrowUp, FaEllipsis, FaTrash } from "react-icons/fa6";
import { useChatScroll } from "../hooks";
import {
  CreatePostDTO,
  PostDetailDTO,
  PostVisibility,
  TESTNET_CHAIN_NAME
} from "@coredin/shared";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomToast, useMutableServerState } from "@/hooks";
import { FEED_MUTATIONS } from "@/queries/FeedMutations";
import { BaseServerStateKeys } from "@/constants";
import { useChain } from "@cosmos-kit/react";

type ChatProps = {
  chatWithUsername: string;
  message: PostDetailDTO;
};

export const Chat: FC<ChatProps> = ({ chatWithUsername, message }) => {
  const conversation = [message, ...message.replies];
  const ref = useChatScroll(conversation);
  const { wallet } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutableServerState(
    FEED_MUTATIONS.publish()
  );
  const { mutateAsync: deletePost, isPending: isDeleting } =
    useMutableServerState(FEED_MUTATIONS.deletePost());
  const { isOpen, onOpen, onClose } = useDisclosure();
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const cancelRef = useRef(null);
  const { successToast } = useCustomToast();
  const navigate = useNavigate();

  const showOptions = message.creatorWallet === chainContext.address;

  const isInitialisedByMe = message.creatorWallet === chainContext.address;

  console.log("conversation", conversation);

  const handleSendMessage = async () => {
    const post: CreatePostDTO = {
      text: newMessage,
      visibility: PostVisibility.PRIVATE,
      replyToPostId: message.id
    };
    await mutateAsync({ post });
    await queryClient.invalidateQueries({
      queryKey: [BaseServerStateKeys.POST]
    });
    setNewMessage("");
  };

  const handleDelete = async () => {
    console.log("message id", message.id);
    await deletePost({ postId: message.id }).then(() => {
      queryClient.invalidateQueries();
    });
    navigate(ROUTES.MESSAGES.path);
    successToast("Message deleted successfully");
  };

  return (
    <Flex
      layerStyle="cardBox"
      p="1em"
      direction="column"
      gap="1em"
      h={{ base: "72dvh", sm: "78dvh", lg: "91vh" }}
      //   border="1px solid red"
    >
      <Flex justify="space-between" align="center">
        <Link
          as={ReactRouterLink}
          to={ROUTES.MESSAGES.path}
          _hover={{ textDecoration: "none" }}
        >
          <Icon as={ArrowBackIcon} />
        </Link>
        <Link
          as={ReactRouterLink}
          to={
            isInitialisedByMe
              ? ROUTES.USER.buildPath(message.recipients?.[0].wallet)
              : ROUTES.USER.buildPath(message.creatorWallet)
          }
          _hover={{ textDecoration: "none" }}
        >
          <HStack justifySelf="center">
            <Avatar
              name={
                isInitialisedByMe
                  ? message.recipients?.[0].username
                  : message.creatorUsername
              }
              src={
                isInitialisedByMe
                  ? message.recipients?.[0].avatarUrl
                  : message.creatorAvatar
              }
              bg="brand.100"
              color={
                isInitialisedByMe
                  ? message.recipients?.[0].creatorFallbackColor
                  : message.creatorAvatarFallbackColor || "brand.500"
              }
              border={
                !isInitialisedByMe && message.creatorAvatar
                  ? "none"
                  : isInitialisedByMe && message.recipients?.[0].avatarUrl
                    ? "none"
                    : "1px solid #b0b0b0"
              }
              size={{ base: "xs", sm: "sm" }}
            />
            <Text as="span" textStyle="sm">
              {isInitialisedByMe
                ? message.recipients?.[0].username
                : message.creatorUsername}
            </Text>
          </HStack>
        </Link>
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
                Delete message
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
      <Flex
        ref={ref}
        as="section"
        direction="column"
        gap="0.5em"
        layerStyle="cardBox"
        p="1em"
        pb="0"
        h="100%"
        overflow="auto"
      >
        {conversation.map((message) => (
          <ChatMessage
            key={message.id}
            messageText={message.text}
            isMyOwnMessage={message.creatorWallet === wallet ? true : false}
            createdAt={message.createdAt}
          />
        ))}
      </Flex>
      <Flex
        gap="0.75em"
        // border="1px solid green"
        //
      >
        <AutoResizeTextarea
          maxH="160px"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button
          variant="primary"
          size="sm"
          h="100%"
          onClick={handleSendMessage}
          isLoading={isPending}
          isDisabled={!newMessage}
          aria-label="post"
          px="0"
        >
          <Icon as={FaArrowUp} />
        </Button>
      </Flex>
    </Flex>
  );
};
