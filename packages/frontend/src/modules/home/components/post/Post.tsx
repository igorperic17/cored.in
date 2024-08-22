import { useLoggedInServerState, useMutableServerState } from "@/hooks";
import { USER_QUERIES } from "@/queries";
import { FEED_MUTATIONS } from "@/queries/FeedMutations";
import { FEED_QUERIES } from "@/queries/FeedQueries";
import { Text, VStack } from "@chakra-ui/react";
import { PostDTO, TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Content } from "./components";
import { NewPost } from "../NewPost";

export type PostProps = {
  post: PostDTO;
  isParent?: boolean;
  isReply?: boolean;
};

export const Post: React.FC<PostProps> = ({ post, isParent, isReply }) => {
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

  const [opened, setOpened] = React.useState(isParent ?? false);
  const { data: postDetail, isLoading: isDetailLoading } =
    useLoggedInServerState(FEED_QUERIES.get(post.id, post.creatorWallet), {
      enabled: opened
    });

  useEffect(() => {
    setIsLiked(userProfile?.likedPosts.includes(post.id) || false);
  }, [userProfile?.likedPosts]);

  const handleLike = () => {
    like({ postId: post.id, liked: !isLiked }).then(() => {
      queryClient.invalidateQueries();
    });
    setIsLiked((prev) => !prev);
  };

  const handleComment = async () => {
    if (isParent) {
      return;
    }

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
      spacing="0.5em"
      w="100%"
      h="max-content"
      layerStyle="cardBox"
    >
      {postDetail?.parent && !isReply && (
        <Content
          post={postDetail.parent}
          showOptions={postDetail.parent.creatorWallet === chainContext.address}
          key={postDetail.parent.id}
          isDeleting={isDeleting}
          handleDelete={handleDelete}
          opened={opened}
          isLiked={isLiked}
          isLiking={isLiking}
          isDetailLoading={isDetailLoading}
          handleComment={handleComment}
          handleLike={handleLike}
          // isParent={true}
          // TODO - add ActionBar and revise this part
        />
      )}
      {postDetail && !postDetail.parent && post.replyToPostId && (
        <Text>
          This post is a reply to a post that has been deleted by its author
        </Text>
      )}
      <Content
        post={post}
        showOptions={post.creatorWallet === chainContext.address}
        isDeleting={isDeleting}
        handleDelete={handleDelete}
        opened={opened}
        isLiked={isLiked}
        isLiking={isLiking}
        isDetailLoading={isDetailLoading}
        handleComment={handleComment}
        handleLike={handleLike}
      />
      {opened && !isParent && <NewPost replyToPostId={post.id} />}
      {opened &&
        postDetail &&
        postDetail.replies.map((reply) => (
          <Post key={reply.id} post={reply} isReply={true} />
        ))}
    </VStack>
  );
};
