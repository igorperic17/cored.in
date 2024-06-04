import { ROUTES } from "@/router/routes";
import { Button, Flex, useTheme } from "@chakra-ui/react";
import { FC } from "react";
import { FaComment, FaEye, FaRegHeart, FaRetweet } from "react-icons/fa6";
import { PostContentProps } from "./PostContent";
import { Link as ReactRouterLink } from "react-router-dom";

export const PostActionBar: FC<
  Omit<PostContentProps, "handleDelete" | "isDeleting">
> = ({
  post,
  opened,
  isLiked,
  isDetailLoading,
  handleComment,
  handleLike,
  isLiking
}) => {
  const theme = useTheme();

  return (
    <Flex w="100%" justify="space-around">
      <Button
        variant="empty"
        aria-label="Add comment."
        fontSize="1rem"
        color={opened ? theme.colors.brand["500"] : "text.400"}
        leftIcon={<FaComment fontSize="1.25rem" />}
        onClick={handleComment}
        isLoading={isDetailLoading}
      />
      <Button
        as={ReactRouterLink}
        to={ROUTES.USER.POST.buildPath(post.creatorWallet, post.id)}
        variant="empty"
        aria-label="Add comment."
        fontSize="1rem"
        color={"text.400"}
        leftIcon={<FaEye fontSize="1.25rem" />}
      />
      <Button
        variant="empty"
        aria-label="Repost."
        size="1rem"
        color="text.400"
        leftIcon={<FaRetweet fontSize="1.5rem" />}
      />
      <Button
        variant="empty"
        aria-label="Like the post."
        size="1rem"
        color={isLiked ? theme.colors.brand["500"] : "text.400"}
        // color={"text.400"}
        leftIcon={<FaRegHeart fontSize="1.25rem" />}
        onClick={handleLike}
        isLoading={isLiking}
      >
        {post.likes}
      </Button>
    </Flex>
  );
};
