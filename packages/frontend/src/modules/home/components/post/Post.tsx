import { useLoggedInServerState, useMutableServerState } from "@/hooks";
import { USER_QUERIES } from "@/queries";
import { FEED_MUTATIONS } from "@/queries/FeedMutations";
import { FEED_QUERIES } from "@/queries/FeedQueries";
import { Text, VStack } from "@chakra-ui/react";
import {
  PostDTO,
  PostInfo,
  TESTNET_CHAIN_NAME,
  TESTNET_FEE_DENOM
} from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { Content, TippingModal } from "./components";
import { useParams } from "react-router-dom";
import { BaseServerStateKeys } from "@/constants";
import { CoredinClientContext } from "@/contexts/CoredinClientContext";
import { coin } from "@cosmjs/amino";
import { NewReply } from "./components";

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
  const { mutateAsync: tipPost, isPending: isTipping } = useMutableServerState(
    FEED_MUTATIONS.tipPost()
  );
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const coredinClient = useContext(CoredinClientContext);

  const { data: userProfile } = useLoggedInServerState(
    USER_QUERIES.getUser(chainContext.address || ""),
    {
      enabled: !!chainContext.address
    }
  );

  const [isLiked, setIsLiked] = React.useState(
    userProfile?.likedPosts.includes(post.id) || false
  );

  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState(10);

  const { id: postId } = useParams();
  const [opened, setOpened] = React.useState(
    isParent ?? Number(postId) === post.id ?? false
  );
  const { data: postDetail, isLoading: isDetailLoading } =
    useLoggedInServerState(FEED_QUERIES.get(post.id, post.creatorWallet), {
      enabled: opened
    });

  useEffect(() => {
    setIsLiked(userProfile?.likedPosts.includes(post.id) || false);
  }, [userProfile?.likedPosts]);

  const handleLike = () => {
    like({ postId: post.id, liked: !isLiked }).then(() => {
      queryClient.invalidateQueries({
        queryKey: [BaseServerStateKeys.FEED]
      });
      queryClient.invalidateQueries({
        queryKey: [BaseServerStateKeys.POST]
      });
      // queryClient.invalidateQueries({
      //   queryKey: [BaseServerStateKeys.USER]
      // });
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

  const handleTipClick = async () => {
    setIsTipModalOpen(true);
  };

  const handleTip = async (): Promise<boolean> => {
    let tipCoins = coin(tipAmount * 1.05 * 1_000_000, TESTNET_FEE_DENOM);

    const postInfo: PostInfo = {
      id: post.id.toString(),
      author: post.creatorWallet,
      created_on: "0",
      hash: "", // Correctly hash the post content
      post_type: "Microblog",
      vault: tipCoins
    };

    try {
      await coredinClient?.tipPostAuthor({ postInfo }, "auto", undefined, [
        tipCoins
      ]);

      await tipPost({ postId: post.id });

      queryClient.invalidateQueries();
      return true;
    } catch (error) {
      console.error("Error tipping post:", error);
      return false;
    }
  };

  return (
    <>
      <VStack
        align="start"
        spacing="0.5em"
        w="100%"
        h="max-content"
        layerStyle="cardBox"
        py="1em"
      >
        {postDetail?.parent && !isReply && (
          <Content
            post={postDetail.parent}
            showOptions={
              postDetail.parent.creatorWallet === chainContext.address
            }
            key={postDetail.parent.id}
            isDeleting={isDeleting}
            handleDelete={handleDelete}
            opened={opened}
            isLiked={isLiked}
            isLiking={isLiking}
            isDetailLoading={isDetailLoading}
            handleComment={handleComment}
            handleLike={handleLike}
            handleTip={handleTip}
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
          handleTip={handleTipClick}
        />
        {opened && !isParent && <NewReply replyToPostId={post.id} />}
        {opened &&
          postDetail &&
          postDetail.replies.map((reply) => (
            <Post key={reply.id} post={reply} isReply={true} />
          ))}
      </VStack>
      <TippingModal
        tipAmount={tipAmount}
        setTipAmount={setTipAmount}
        handleTip={handleTip}
        isTipModalOpen={isTipModalOpen}
        setIsTipModalOpen={setIsTipModalOpen}
      />
    </>
  );
};
