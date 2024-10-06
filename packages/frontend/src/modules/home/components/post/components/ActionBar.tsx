import { ROUTES } from "@/router/routes";
import {
  Box, Button, Flex, IconButton, Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  InputRightElement
} from "@chakra-ui/react";
import { Text, VStack, Link, HStack } from "@chakra-ui/layout";

import { FC, useState } from "react";
import {
  FaArrowUp,
  FaCoins,
  FaDollarSign,
  FaHeart,
  FaRegComment,
  FaRegEye,
  FaRegHeart,
  FaRetweet
} from "react-icons/fa6";
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
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState(10);
  const { successToast } = useCustomToast();

  const postUrl = ROUTES.USER.POST.buildPath(post.creatorWallet, post.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + postUrl);
    successToast("Post URL copied to clipboard");
  };


  const handleTip = async () => {
    if (!tipAmount) return;
    setTipModalOpen(false);
    // Assuming there's a function to initiate the transaction
    // This is a placeholder for the actual transaction logic
    // The actual implementation would involve using the services to perform the transaction
    // For example, coredinSignerService.register() or issuerService.requestIssuance()
    console.log(`Initiating transaction for ${tipAmount} core tokens`);
    // After transaction logic, close the modal
    setTipModalOpen(false);
  };

  return (
    <>
      <Flex
        w="100%"
        // ml="auto"
        justify="space-between"
      // border="1px solid red"
      >
        <Button
          variant="empty"
          aria-label="Send tip to promote this post."
          size="1rem"
          color="text.700"
          leftIcon={<Icon as={FaDollarSign} fontSize="1.25rem" />}
          onClick={() => setTipModalOpen(true)}
        // isLoading={isLiking}
        >
          <Box as="span" transition={"opacity 2s"}>
            {post.tips ? `${post.tips.toFixed(2)}` : "0.00"}
          </Box>
        </Button>
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
      </Flex>
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
                defaultValue="10"
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
