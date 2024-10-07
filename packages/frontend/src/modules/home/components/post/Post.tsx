import { useLoggedInServerState, useMutableServerState } from "@/hooks";
import { USER_QUERIES } from "@/queries";
import { FEED_MUTATIONS } from "@/queries/FeedMutations";
import { FEED_QUERIES } from "@/queries/FeedQueries";
import {
  Text, VStack, Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Icon,
  Button
} from "@chakra-ui/react";
import { PostDTO, TESTNET_CHAIN_NAME } from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Content } from "./components";
import { NewPost } from "../NewPost";
import { useParams, Link } from "react-router-dom";
import { BaseServerStateKeys } from "@/constants";
import { FaCoins } from "react-icons/fa6";

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
  const { mutateAsync: tipPost, isPending: isTipping } =
    useMutableServerState(FEED_MUTATIONS.tipPost());
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const { data: userProfile } = useLoggedInServerState(
    USER_QUERIES.getUser(chainContext.address || ""),
    {
      enabled: !!chainContext.address
    }
  );

  const [isLiked, setIsLiked] = React.useState(
    userProfile?.likedPosts.includes(post.id) || false
  );

  const [tipModalOpen, setTipModalOpen] = useState(false);
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
    setTipModalOpen(true);
  }

  const handleTip = async () => {

    setTipModalOpen(false);

    // TODO: perform on-chain transaction, continue after successfull confirmation

    await tipPost({ postId: post.id, tipAmount: tipAmount }).then(() => {
      queryClient.invalidateQueries();
    });
  };

  return (
    <>
      <VStack
        // as={Link}
        // to={`/user/${userProfile?.wallet}/posts/${post.id}`}
        align="start"
        spacing="0.5em"
        w="100%"
        h="max-content"
        layerStyle="cardBox"
        py="1em"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)" // Added shadow for floating effect
        _hover={{ transform: "scale(1.01)", transition: "transform 0.1s" }} // Added slight zoom in on hover with animation
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
        {opened && !isParent && <NewPost replyToPostId={post.id} />}
        {opened &&
          postDetail &&
          postDetail.replies.map((reply) => (
            <Post key={reply.id} post={reply} isReply={true} />
          ))}
      </VStack>
      <Modal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Tip</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="4">Enter the amount of CORE you'd like to tip.</Text>
            {/* <Text mb="4" fontSize="sm">The amount will be split 95% to the author and 5% to the cored.in team.</Text> */}
            <InputGroup width="40%" border="1px solid gray" borderRadius="xl">
              <InputLeftElement pointerEvents="none" pr="2">
                <Icon as={FaCoins} color="gray.700" pb="1" />
              </InputLeftElement>
              <Input
                border="1px solid gray.900" borderRadius="xl"
                placeholder="Amount"
                value={tipAmount}
                onChange={(e) => setTipAmount(Number(e.target.value))}
                size="sm"
                pr="4"
                _focus={{ border: "1px solid blue.500" }}
                borderStyle="solid"
              />
              <InputRightElement pointerEvents="none" pr="5" pb="2">
                <Text>CORE</Text>
              </InputRightElement>
            </InputGroup>
            <Text mt="6" fontSize="sm">Author gets 95%: {tipAmount ? `${(tipAmount * 0.95).toFixed(2)} CORE` : '0.00 CORE'}</Text>
            <Text mt="1" fontSize="sm">Platform commission 5%: {tipAmount ? `${(tipAmount * 0.05).toFixed(2)} CORE` : '0.00 CORE'}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleTip}>Send</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
