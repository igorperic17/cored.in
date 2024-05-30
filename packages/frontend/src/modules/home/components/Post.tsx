import {
  useAuth,
  useLoggedInServerState,
  useMutableServerState
} from "@/hooks";
import { USER_QUERIES } from "@/queries";
import { FEED_MUTATIONS } from "@/queries/FeedMutations";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  VStack,
  useTheme
} from "@chakra-ui/react";
import { PostDTO, TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { FaComment, FaEllipsis, FaRegHeart, FaRetweet } from "react-icons/fa6";

export type PostProps = {
  post: PostDTO;
};

export const Post: React.FC<PostProps> = ({ post }) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { mutateAsync: like, isPending: isLiking } = useMutableServerState(
    FEED_MUTATIONS.likePost()
  );
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const { needsAuth } = useAuth();
  const { data: userProfile } = useLoggedInServerState(
    USER_QUERIES.getUser(chainContext.address || "", needsAuth),
    { enabled: !!chainContext.address }
  );
  const [isLiked, setIsLiked] = React.useState(
    userProfile?.likedPosts.includes(post.id) || false
  );

  useEffect(() => {
    setIsLiked(userProfile?.likedPosts.includes(post.id) || false);
  }, [userProfile?.likedPosts]);

  const handleLike = async () => {
    await like({ postId: post.id, liked: !isLiked }).then(() => {
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
      <Flex align="center" gap="1em" w="100%">
        <Avatar
          name="U N"
          // src="https://bit.ly/sage-adebayo"
          bg="background.600"
          color="brand.500"
        />
        <Flex direction="column">
          <Text as="span" color="text.100">
            @username
            {/* {post.creatorWallet} */}
          </Text>
        </Flex>
        <IconButton
          variant="empty"
          aria-label="See menu."
          color="text.400"
          alignSelf="start"
          ml="auto"
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
          color={isLiked ? theme.colors.brand["500"] : "text.400"}
          // color={"text.400"}
          leftIcon={<FaRegHeart fontSize="1.25rem" />}
          onClick={handleLike}
          isLoading={isLiking}
        >
          {post.likes}
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
