import { AutoResizeTextarea } from "@/components";
import {
  Avatar,
  Button,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction } from "react";
import { visibilityData } from "../constants";
import { PostVisibility, UserProfile } from "@coredin/shared";

export type NewContentProps = {
  postContent: string;
  setPostContent: Dispatch<SetStateAction<string>>;
  handlePost: () => void;
  isLoading: boolean;
  visibility: PostVisibility;
  setVisibility: (visibility: PostVisibility) => void;
  userProfile: UserProfile;
};

export const NewPostContent: FC<NewContentProps> = ({
  postContent,
  setPostContent,
  handlePost,
  isLoading,
  visibility,
  setVisibility,
  userProfile
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      direction="column"
      align="start"
      gap="1.125em"
      w="100%"
      h="max-content"
      layerStyle="cardBox"
      // outline="1px solid red"
      p="1.125em"
    >
      <Flex align="start" gap="1.125em" w="100%">
        <Avatar
          name={userProfile.username}
          src={userProfile.avatarUrl}
          size="md"
          bg="background.600"
          color={userProfile.avatarFallbackColor || "brand.500"}
        />
        <AutoResizeTextarea
          placeholder="Share your thoughts"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          variant="unstyled"
          border="1px solid #828178"
          borderRadius="0.5em"
          p="0.5em"
          // textStyle="lg"
          // border="none"
          // borderRadius="0"
          // borderBottom="2px solid"
          // borderBottomColor="background.400"
        />
      </Flex>
      <HStack alignSelf="end" spacing="1.5em">
        <Button
          variant="empty"
          size="sm"
          textTransform="none"
          color="text.100"
          fontWeight="normal"
          onClick={onOpen}
        >
          {visibilityData.find((item) => item.value === visibility)?.title}
        </Button>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Choose who can see your post</ModalHeader>
            <ModalCloseButton size="xl" top="1.5em" right="1.5em" />
            <ModalBody>
              <RadioGroup
                onChange={(e) => setVisibility(e as PostVisibility)}
                value={visibility}
              >
                <VStack align="start">
                  {visibilityData.map((vis, index) => (
                    <Radio key={`visibility-${index}`} value={vis.value}>
                      {vis.title}
                    </Radio>
                  ))}
                </VStack>
              </RadioGroup>
            </ModalBody>

            <ModalFooter>
              <Button variant="primary" size="sm" mt="1em" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Button
          variant="primary"
          size="sm"
          alignSelf="end"
          onClick={handlePost}
          isLoading={isLoading}
          isDisabled={!postContent}
        >
          Post
        </Button>
      </HStack>
    </Flex>
  );
};
