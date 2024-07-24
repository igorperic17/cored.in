import { BaseServerStateKeys } from "@/constants";
import { useMutableServerState } from "@/hooks";
import { FEED_MUTATIONS } from "@/queries/FeedMutations";
import { CreatePostDTO, PostVisibility } from "@coredin/shared";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { NewPostContent, NewReplyContent } from "./post/components";

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

  const handlePost = async () => {
    const post: CreatePostDTO = {
      text: postContent,
      visibility,
      replyToPostId
    };
    await mutateAsync({ post });
    await queryClient.invalidateQueries({
      queryKey: replyToPostId
        ? [BaseServerStateKeys.POST] // todo - handle single post refresh!
        : [BaseServerStateKeys.FEED]
    });
    setPostContent("");
  };

  return (
    <>
      {replyToPostId ? (
        <NewReplyContent
          postContent={postContent}
          setPostContent={setPostContent}
          handlePost={handlePost}
          isLoading={isPending}
          visibility={visibility}
          setVisibility={setVisibility}
        />
      ) : (
        <NewPostContent
          postContent={postContent}
          setPostContent={setPostContent}
          handlePost={handlePost}
          isLoading={isPending}
          visibility={visibility}
          setVisibility={setVisibility}
        />
      )}
    </>
  );
};
