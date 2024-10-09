import { BaseServerStateKeys } from "@/constants";
import { useLoggedInServerState, useMutableServerState } from "@/hooks";
import { FEED_MUTATIONS } from "@/queries/FeedMutations";
import {
  CreatePostDTO,
  PostVisibility,
  TESTNET_CHAIN_NAME
} from "@coredin/shared";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { NewReplyContent } from "./post/components";
import { useChain } from "@cosmos-kit/react";
import { USER_QUERIES } from "@/queries";

export type NewPostProps = {
  replyToPostId?: number;
};

export const NewPost: React.FC<NewPostProps> = ({ replyToPostId }) => {
  const queryClient = useQueryClient();
  const [postContent, setPostContent] = useState("");
  const { mutateAsync, isPending } = useMutableServerState(
    FEED_MUTATIONS.publish()
  );
  const [visibility, setVisibility] = useState<PostVisibility>(
    PostVisibility.PUBLIC
  );
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const { data: userProfile } = useLoggedInServerState(
    USER_QUERIES.getUser(chainContext.address || ""),
    { enabled: !!chainContext.address }
  );

  const handlePost = async () => {
    const post: CreatePostDTO = {
      text: postContent,
      visibility,
      replyToPostId
    };
    await mutateAsync({ post });
    await queryClient.invalidateQueries({
      queryKey: [BaseServerStateKeys.POST] // todo - handle single post refresh!
    });
    setPostContent("");
  };

  return (
    <>
      {userProfile && replyToPostId && (
        <NewReplyContent
          postContent={postContent}
          setPostContent={setPostContent}
          handlePost={handlePost}
          isLoading={isPending}
          visibility={visibility}
          setVisibility={setVisibility}
          userProfile={userProfile}
        />
      )}
      {/* // ) : (
        //   <NewPostContent
        //     postContent={postContent}
        //     setPostContent={setPostContent}
        //     handlePost={handlePost}
        //     isLoading={isPending}
        //     visibility={visibility}
        //     setVisibility={setVisibility}
        //     userProfile={userProfile}
        //   />
        // ))} */}
    </>
  );
};
