import { ROUTES } from "@/router/routes";
import {
  Box, Button, Flex, IconButton, Center,
  Icon,
  HStack,
} from "@chakra-ui/react";

import { FC } from "react";
import {
  FaDollarSign,
  FaHeart,
  FaRegComment,
  FaRegEye,
  FaRegHeart,
  FaRetweet
} from "react-icons/fa6";
import { PiHandCoins } from "react-icons/pi";
import { Link as ReactRouterLink } from "react-router-dom";
import { PostDTO } from "@coredin/shared";
import { useCustomToast } from "@/hooks";

type PostActionBarProps = {
  post: PostDTO;
  opened: boolean;
  isLiked: boolean;
  isDetailLoading: boolean;
  handleComment: () => void;
  handleLike: () => void;
  handleTip: () => void;
  isLiking: boolean;
};

export const ActionBar: FC<PostActionBarProps> = ({
  post,
  opened,
  isLiked,
  isDetailLoading,
  handleComment,
  handleLike,
  handleTip,
  isLiking
}) => {
  const { successToast } = useCustomToast();

  const postUrl = ROUTES.USER.POST.buildPath(post.creatorWallet, post.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + postUrl);
    successToast("Post URL copied to clipboard");
  };

  return (
    <>
      <Flex
        w="100%"
        ml="auto"
        justify="space-between"
      // border="1px solid red"
      >

        <HStack spacing="1rem">
          <Button
            variant="empty"
            aria-label="Like the post."
            size="1rem"
            color={isLiked ? "brand.400" : "text.700"}
            _hover={{ color: "brand.400" }}
            leftIcon={
              isLiked ? (
                <FaHeart fontSize="1.25rem" />
              ) : (
                <FaRegHeart fontSize="1.25rem" />
              )
            }
            onClick={handleLike}
          // isLoading={isLiking}
          >
            <Box as="span" opacity={isLiking ? 0 : 1} transition={"opacity 2s"}>
              {post.likes}
            </Box>
          </Button>
          <IconButton
            icon={<FaRegComment fontSize="1.25rem" />}
            variant="empty"
            aria-label="Add comment."
            fontSize="1rem"
            color={opened ? "brand.300" : "text.700"}
            onClick={handleComment}
            isLoading={isDetailLoading}
          />

          <IconButton
            icon={<FaRetweet fontSize="1.5rem" />}
            variant="empty"
            aria-label="Share."
            size="1rem"
            color="text.700"
            onClick={handleShare}
          />

          <IconButton
            as={ReactRouterLink}
            icon={<FaRegEye fontSize="1.25rem" />}
            to={postUrl}
            variant="empty"
            aria-label="Add comment."
            fontSize="1rem"
            color="text.700"
          />
        </HStack>

        <Button
          variant="empty"
          aria-label="Send tip to promote this post."
          fontSize="1rem"
          color="text.700"
          leftIcon={<Icon as={PiHandCoins} fontSize="1.55rem" />}
          onClick={handleTip}
          mr="4"
        >
          <Box as="span" transition={"opacity 2s"}>
            {post.tips ? `${(post.tips / 1000000.0).toFixed(2)}` : "0.00"}
          </Box>
        </Button>
      </Flex>

    </>
  );
};
