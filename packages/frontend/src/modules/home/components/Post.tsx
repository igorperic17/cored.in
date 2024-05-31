import { useLoggedInServerState, useMutableServerState } from "@/hooks";
import { USER_QUERIES } from "@/queries";
import { FEED_MUTATIONS } from "@/queries/FeedMutations";
import { FEED_QUERIES } from "@/queries/FeedQueries";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
  useTheme
} from "@chakra-ui/react";
import { PostDTO, TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import {
  FaComment,
  FaEllipsis,
  FaRegHeart,
  FaRetweet,
  FaTrash
} from "react-icons/fa6";
import { NewPost } from "./NewPost";
import { Link as ReactRouterLink } from "react-router-dom";
import { ROUTES } from "@/router/routes";

export type PostProps = {
  post: PostDTO;
};

export const Post: React.FC<PostProps> = ({ post }) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { mutateAsync: like, isPending: isLiking } = useMutableServerState(
    FEED_MUTATIONS.likePost()
  );
  const { mutateAsync: deletePost, isPending: isDeleting } =
    useMutableServerState(FEED_MUTATIONS.deletePost());
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const { data: userProfile } = useLoggedInServerState(
    USER_QUERIES.getUser(chainContext.address || ""),
    { enabled: !!chainContext.address }
  );

  const [isLiked, setIsLiked] = React.useState(
    userProfile?.likedPosts.includes(post.id) || false
  );

  const [opened, setOpened] = React.useState(false);
  const { data: postDetail, isLoading: isDetailLoading } =
    useLoggedInServerState(FEED_QUERIES.get(post.id), { enabled: opened });

  useEffect(() => {
    setIsLiked(userProfile?.likedPosts.includes(post.id) || false);
  }, [userProfile?.likedPosts]);

  const handleLike = async () => {
    await like({ postId: post.id, liked: !isLiked }).then(() => {
      queryClient.invalidateQueries();
    });
  };

  const handleComment = async () => {
    setOpened(!opened);
  };

  const handleDelete = async () => {
    await deletePost({ postId: post.id }).then(() => {
      queryClient.invalidateQueries();
    });
  };

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
          aria-label="Like the post."
          size="1rem"
          color={isLiked ? theme.colors.brand["500"] : "text.400"}
          // color={"text.400"}
          leftIcon={<FaRegHeart fontSize="1.25rem" />}
          onClick={handleLike}
          // isLoading={isLiking}
        >
          {post?.likes || ""}
        </Button>
        <Button
          variant="empty"
          aria-label="Add comment."
          fontSize="1rem"
          color={opened ? theme.colors.brand["500"] : "text.400"}
          leftIcon={<FaComment fontSize="1.25rem" />}
          onClick={handleComment}
          isLoading={isDetailLoading}
        >
          {postDetail?.replies.length}
        </Button>
        <Button
          as={ReactRouterLink}
          to={ROUTES.USER.POST.buildPath(post.creatorWallet, post.id)}
          variant="empty"
          aria-label="Add comment."
          fontSize="1rem"
          color={opened ? theme.colors.brand["500"] : "text.400"}
          leftIcon={<FaComment fontSize="1.25rem" />}
          isLoading={isDetailLoading}
        >
          {postDetail?.replies.length}
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
      {opened && <NewPost replyToPostId={post.id} />}
      {opened &&
        postDetail &&
        postDetail.replies.map((reply) => <Post key={reply.id} post={reply} />)}
    </VStack>
  );
};
