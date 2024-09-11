import { BaseServerStateKeys } from "@/constants";
import {
  useCustomToast,
  useLoggedInServerState,
  useMutableServerState
} from "@/hooks";
import { FEED_MUTATIONS } from "@/queries/FeedMutations";
import {
  CreatePostDTO,
  PostVisibility,
  TESTNET_CHAIN_NAME
} from "@coredin/shared";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useChain } from "@cosmos-kit/react";
import { CONTRACT_QUERIES, USER_QUERIES } from "@/queries";
import { CoredinClientContext } from "@/contexts/CoredinClientContext";
import { NewMessageModal } from ".";

export type NewMessageProps = {
  isOpen: boolean;
  onClose: () => void;
  toUsername: string;
  replyToPostId?: number;
  recipientWallet: string;
};

export const NewMessage: React.FC<NewMessageProps> = ({
  replyToPostId,
  isOpen,
  onClose,
  toUsername,
  recipientWallet
}) => {
  const queryClient = useQueryClient();
  const coredinClient = useContext(CoredinClientContext);
  const [postContent, setPostContent] = useState("");
  const { mutateAsync, isPending } = useMutableServerState(
    FEED_MUTATIONS.publish()
  );
  const { address } = useChain(TESTNET_CHAIN_NAME);
  const { data: userProfile } = useLoggedInServerState(
    USER_QUERIES.getUser(address || ""),
    { enabled: !!address }
  );
  const subscriptionsQuery = CONTRACT_QUERIES.getSubscriptions(
    coredinClient!,
    address!
  );
  const { successToast, errorToast } = useCustomToast();

  const {
    data: subscriptions,
    fetchNextPage: fetchNextSubscriptionsPage,
    isFetching: isFetchingSubscriptions,
    hasNextPage: hasNextSubscriptionsPage
  } = useInfiniteQuery({
    ...subscriptionsQuery,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (!lastPage.subscribers || lastPage.subscribers.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    }
  });

  // Automatically fetch all paginated subscriptions
  useEffect(() => {
    if (
      address &&
      coredinClient &&
      !isFetchingSubscriptions &&
      hasNextSubscriptionsPage
    )
      fetchNextSubscriptionsPage();
  }, [address, coredinClient, subscriptions]);

  const handleMessage = async () => {
    console.log(postContent);
    const post: CreatePostDTO = {
      text: postContent,
      visibility: PostVisibility.RECIPIENTS,
      recipientWallets: [recipientWallet]
    };
    await mutateAsync({ post });
    await queryClient.invalidateQueries({
      queryKey: replyToPostId
        ? [BaseServerStateKeys.POST] // todo - handle single post refresh!
        : [BaseServerStateKeys.MESSAGES_FEED]
    });
    setPostContent("");
    onClose();
    successToast("Message sent");
  };

  return (
    <>
      {userProfile && isOpen && (
        <NewMessageModal
          isOpen={isOpen}
          onClose={onClose}
          toUsername={toUsername}
          postContent={postContent}
          setPostContent={setPostContent}
          handleMessage={handleMessage}
        />
      )}
    </>
  );
};
