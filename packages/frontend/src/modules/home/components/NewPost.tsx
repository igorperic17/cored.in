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
import { useChain } from "@cosmos-kit/react";
import { USER_QUERIES } from "@/queries";
import { Avatar, Button, Flex, Icon } from "@chakra-ui/react";
import { AutoResizeTextarea } from "@/components";
import { FaArrowUp } from "react-icons/fa6";

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
        <Flex
          direction="row"
          align="center"
          gap="1.125em"
          w="100%"
          h="max-content"
          // outline="1px solid red"
          p="1.125em"
        >
          <Avatar
            name={userProfile.username}
            src={userProfile.avatarUrl}
            size="sm"
            bg="brand.100"
            color={userProfile.avatarFallbackColor || "brand.500"}
            border={userProfile.avatarUrl || "1px solid #b0b0b0"}
          />
          <AutoResizeTextarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            variant="unstyled"
            p="0.5em"
            minH="unset"
            placeholder="Add your comment"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handlePost}
            isLoading={isPending}
            isDisabled={!postContent}
            aria-label="post"
            px="0"
          >
            <Icon as={FaArrowUp} />
          </Button>
        </Flex>
      )}
    </>
  );
};
