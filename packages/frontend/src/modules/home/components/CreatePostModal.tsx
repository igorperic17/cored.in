import { AutoResizeTextarea, MultiSelect } from "@/components";
import { ROUTES } from "@/router/routes";
import { formElementBorderStyles } from "@/themes";
import {
  Avatar,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VisuallyHidden
} from "@chakra-ui/react";
import {
  PostRequestType,
  PostVisibility,
  SkillTag,
  SkillTags,
  UserProfile
} from "@coredin/shared";
import { FC } from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import { requestTypeData, visibilityData } from "./post/constants";

type CreatePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setPostContent: (content: string) => void;
  setRequestType: (type: PostRequestType | undefined) => void;
  setVisibility: (visibility: PostVisibility) => void;
  userProfile?: UserProfile;
  requestType: PostRequestType | undefined;
  visibility: PostVisibility;
  skillTags: SkillTag[];
  setSkillTags: (tags: SkillTag[]) => void;
  postContent: string;
  handlePost: () => Promise<void>;
  isPending: boolean;
};

export const CreatePostModal: FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  setPostContent,
  setRequestType,
  setVisibility,
  userProfile,
  requestType,
  visibility,
  skillTags,
  setSkillTags,
  postContent,
  handlePost,
  isPending
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setPostContent("");
      }}
      size="xl"
      isCentered
    >
      <ModalOverlay />
      <ModalContent p="0">
        <ModalHeader>
          <Flex gap={{ base: "0.75em", sm: "1.125em" }} align="center">
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
            <Link
              as={ReactRouterLink}
              to={ROUTES.USER.buildPath(userProfile?.wallet || "")}
            >
              <Text
                color="brand.900"
                textStyle="md"
                maxW={{
                  base: "14ch",
                  sm: "24ch",
                  md: "36ch",
                  lg: "28ch",
                  xl: "32ch"
                }}
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
              >
                {userProfile?.username || ""}
              </Text>
            </Link>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDir="column" gap="1em">
          <FormControl>
            <VisuallyHidden>
              <FormLabel>Select the type of the post</FormLabel>
            </VisuallyHidden>
            <Select
              {...formElementBorderStyles}
              value={requestType}
              onChange={(e) => {
                const type = Object.values(PostRequestType).includes(
                  e.target.value as PostRequestType
                )
                  ? (e.target.value as PostRequestType)
                  : undefined;
                setRequestType(type);
              }}
            >
              {requestTypeData.map((type) => (
                <option key={`request-type-${type.value}`} value={type.value}>
                  {type.title}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <VisuallyHidden>
              <FormLabel>Select who can see the post</FormLabel>
            </VisuallyHidden>
            <Select
              {...formElementBorderStyles}
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as PostVisibility)}
            >
              {visibilityData.map((visData) => (
                <option
                  key={`visibility-${visData.value}`}
                  value={visData.value}
                >
                  {visData.title}
                </option>
              ))}
            </Select>
          </FormControl>
          {(requestType === PostRequestType.JOB ||
            requestType === PostRequestType.GIG) && (
            <FormControl>
              <VisuallyHidden>
                Select the tags related to the post
              </VisuallyHidden>
              <MultiSelect
                options={SkillTags.map((tag) => ({ label: tag, value: tag }))}
                value={skillTags.map((tag) => ({ label: tag, value: tag }))}
                onChange={(newTags) => setSkillTags(newTags.map((tag) => tag.value as SkillTag))}
                placeholder="Select skills"
                menuPlacement="bottom"
              />
            </FormControl>
          )}

          <AutoResizeTextarea
            placeholder="Write the text, choose the post type, set the visibility and share it"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            minH="50vh"
            variant="unstyled"
            p="1em"
          />
        </ModalBody>

        <ModalFooter>
          <Button
            variant="empty"
            color="text.700"
            size="sm"
            onClick={onClose}
            mr="1.5em"
          >
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePost}
            isDisabled={!postContent || isPending}
            isLoading={isPending}
          >
            Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
