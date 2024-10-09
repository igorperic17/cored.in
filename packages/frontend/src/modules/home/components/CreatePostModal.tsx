import { AutoResizeTextarea } from "@/components";
import { ROUTES } from "@/router/routes";
import { formElementBorderStyles } from "@/themes";
import {
  Avatar,
  Button,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr
} from "@chakra-ui/react";
import { PostRequestType, PostVisibility, UserProfile } from "@coredin/shared";
import { FC } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

type CreatePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setPostContent: (content: string) => void;
  setRequestType: (type: PostRequestType | undefined) => void;
  setVisibility: (visibility: PostVisibility) => void;
  userProfile?: UserProfile;
  requestType: PostRequestType | undefined;
  visibility: PostVisibility;
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
        <ModalBody>
          <TableContainer whiteSpace="normal" mb="1em">
            <Table variant="unstyled" layout="fixed">
              <Tbody>
                <Tr>
                  <Td pl="0" pb="0">
                    Post type:
                  </Td>
                  <Td px="0" pb="0">
                    <Select
                      {...formElementBorderStyles}
                      value={requestType}
                      onChange={(e) =>
                        setRequestType(e.target.value as PostRequestType)
                      }
                    >
                      <option value={undefined}>Microblog post</option>
                      {Object.values(PostRequestType).map((type) => (
                        <option key={type} value={type}>
                          {type[0].toUpperCase() + type.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </Select>
                  </Td>
                </Tr>

                <Tr>
                  <Td pl="0" pb="0">
                    Visibility:
                  </Td>
                  <Td px="0" pb="0">
                    <Select
                      {...formElementBorderStyles}
                      value={visibility}
                      onChange={(e) =>
                        setVisibility(e.target.value as PostVisibility)
                      }
                    >
                      {Object.values(PostVisibility).map((vis) => (
                        <option key={vis} value={vis}>
                          {vis[0].toUpperCase() + vis.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </Select>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <AutoResizeTextarea
            placeholder="Write the text, choose the post type, set the visibility and share it"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            minH="50vh"
            variant="unstyled"
            p="0.5em"
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