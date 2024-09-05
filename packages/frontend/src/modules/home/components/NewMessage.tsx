import { BaseServerStateKeys } from "@/constants";
import { useLoggedInServerState, useMutableServerState } from "@/hooks";
import { FEED_MUTATIONS } from "@/queries/FeedMutations";
import {
  CreatePostDTO,
  PostVisibility,
  TESTNET_CHAIN_NAME
} from "@coredin/shared";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import {
  NewMessageContent,
  NewPostContent,
  NewReplyContent
} from "./post/components";
import { useChain } from "@cosmos-kit/react";
import { CONTRACT_QUERIES, USER_QUERIES } from "@/queries";
import { CoredinClientContext } from "@/contexts/CoredinClientContext";

export type NewMessageProps = {
  replyToPostId?: number;
};

export const NewMessage: React.FC<NewMessageProps> = ({ replyToPostId }) => {
  const queryClient = useQueryClient();
  const coredinClient = useContext(CoredinClientContext);
  const [postContent, setPostContent] = useState("");
  const [recipientWallets, setRecipientWallets] = useState<string[]>([]);
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

  const handlePost = async () => {
    const post: CreatePostDTO = {
      text: postContent,
      visibility: PostVisibility.RECIPIENTS,
      recipientWallets
    };
    await mutateAsync({ post });
    await queryClient.invalidateQueries({
      queryKey: replyToPostId
        ? [BaseServerStateKeys.POST] // todo - handle single post refresh!
        : [BaseServerStateKeys.MESSAGES_FEED]
    });
    setPostContent("");
    setRecipientWallets([]);
  };

  return (
    <>
      {userProfile && (
        <NewMessageContent
          postContent={postContent}
          setPostContent={setPostContent}
          handlePost={handlePost}
          isLoading={isPending}
          recipients={recipientWallets}
          setRecipients={setRecipientWallets}
          userProfile={userProfile}
          subscriptions={
            subscriptions?.pages.flatMap((page) => page.subscribers) || []
          }
        />
      )}
    </>
  );
};
