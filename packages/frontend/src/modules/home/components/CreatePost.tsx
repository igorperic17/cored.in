import { BaseServerStateKeys } from "@/constants";
import { useLoggedInServerState, useMutableServerState } from "@/hooks";
import { USER_QUERIES } from "@/queries";
import { FEED_MUTATIONS } from "@/queries/FeedMutations";
import { ROUTES } from "@/router/routes";
import { formElementBorderStyles } from "@/themes";
import {
  Avatar,
  Button,
  Flex,
  Link,
  useDisclosure,
  useMediaQuery,
  useTheme
} from "@chakra-ui/react";
import {
  CreatePostDTO,
  PostRequestType,
  PostVisibility,
  SkillTag,
  TESTNET_CHAIN_NAME
} from "@coredin/shared";
import { useChain } from "@cosmos-kit/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { CreatePostModal } from "./CreatePostModal";

export const CreatePost = () => {
  const queryClient = useQueryClient();
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const { data: userProfile } = useLoggedInServerState(
    USER_QUERIES.getUser(chainContext.address || ""),
    { enabled: !!chainContext.address }
  );
  const { mutateAsync, isPending } = useMutableServerState(
    FEED_MUTATIONS.publish()
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postContent, setPostContent] = useState("");
  const [visibility, setVisibility] = useState<PostVisibility>(
    PostVisibility.PUBLIC
  );
  const [requestType, setRequestType] = useState<PostRequestType | undefined>(
    undefined
  );
  const [skillTags, setSkillTags] = useState<SkillTag[]>([]);
  const theme = useTheme();
  const [isLargerThanSm] = useMediaQuery(
    `(min-width: ${theme.breakpoints.sm})`
  );

  const handlePost = async () => {
    const post: CreatePostDTO = {
      text: postContent,
      visibility,
      requestType,
      skillTags
    };
    // console.log("post", post);
    await mutateAsync({ post });
    await queryClient.invalidateQueries({
      queryKey: [BaseServerStateKeys.FEED]
    });
    setPostContent("");
    onClose();
  };

  return (
    <>
      <Flex gap="1.125em" layerStyle="cardBox" w="100%">
        <Link
          as={ReactRouterLink}
          to={ROUTES.USER.buildPath(userProfile?.wallet || "")}
        >
          <Avatar
            name={userProfile?.username}
            src={userProfile?.avatarUrl}
            size={{ base: "sm", sm: "md" }}
            bg="brand.100"
            color={userProfile?.avatarFallbackColor || "brand.500"}
            border={userProfile?.avatarUrl || "1px solid #b0b0b0"}
          />
        </Link>
        <Button
          w="100%"
          h="48px"
          bg="none"
          {...formElementBorderStyles}
          _active={{
            bg: "transparent"
          }}
          color="text.700"
          fontSize={{ base: "0.875rem", lg: "1rem" }}
          fontWeight="400"
          textTransform="none"
          justifyContent="start"
          onClick={onOpen}
        >
          {isLargerThanSm
            ? "Create a post or share a work opportunity"
            : "Create a post"}
        </Button>
      </Flex>

      <CreatePostModal
        isOpen={isOpen}
        onClose={onClose}
        setPostContent={setPostContent}
        setRequestType={setRequestType}
        setVisibility={setVisibility}
        userProfile={userProfile}
        requestType={requestType}
        visibility={visibility}
        skillTags={skillTags || []}
        setSkillTags={(newTags: SkillTag[]) =>
          setSkillTags(newTags)
        }
        postContent={postContent}
        handlePost={handlePost}
        isPending={isPending}
      />
    </>
  );
};
