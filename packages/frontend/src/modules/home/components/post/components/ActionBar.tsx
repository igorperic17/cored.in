import { ROUTES } from "@/router/routes";
import { Button, Flex, IconButton } from "@chakra-ui/react";
import { FC } from "react";
import {
  FaHeart,
  FaRegComment,
  FaRegEye,
  FaRegHeart,
  FaRetweet
} from "react-icons/fa6";
import { Link as ReactRouterLink } from "react-router-dom";
import { PostDTO } from "@coredin/shared";

type PostActionBarProps = {
  post: PostDTO;
  opened: boolean;
  isLiked: boolean;
  isDetailLoading: boolean;
  handleComment: () => void;
  handleLike: () => void;
  isLiking: boolean;
};

export const ActionBar: FC<PostActionBarProps> = ({
  post,
  opened,
  isLiked,
  isDetailLoading,
  handleComment,
  handleLike,
  isLiking
}) => {
  return (
    <Flex
      w="100%"
      ml="auto"
      justify="space-between"
      // border="1px solid red"
    >
      <Button
        variant="empty"
        aria-label="Like the post."
        size="1rem"
        color={isLiked ? "brand.500" : "text.400"}
        leftIcon={
          isLiked ? (
            <FaHeart fontSize="1.25rem" />
          ) : (
            <FaRegHeart fontSize="1.25rem" />
          )
        }
        onClick={handleLike}
        isLoading={isLiking}
      >
        {post.likes}
      </Button>
      <IconButton
        icon={<FaRegComment fontSize="1.25rem" />}
        variant="empty"
        aria-label="Add comment."
        fontSize="1rem"
        color={opened ? "text.100" : "text.400"}
        onClick={handleComment}
        isLoading={isDetailLoading}
      />

      <IconButton
        icon={<FaRetweet fontSize="1.5rem" />}
        variant="empty"
        aria-label="Repost."
        size="1rem"
        color="text.400"
      />

      <IconButton
        as={ReactRouterLink}
        icon={<FaRegEye fontSize="1.25rem" />}
        to={ROUTES.USER.POST.buildPath(post.creatorWallet, post.id)}
        variant="empty"
        aria-label="Add comment."
        fontSize="1rem"
        color={"text.400"}
      />
    </Flex>
  );
};
