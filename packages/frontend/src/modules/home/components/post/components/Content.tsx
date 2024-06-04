import { Flex, Box, Text } from "@chakra-ui/layout";
import React from "react";
import { PostDTO } from "@coredin/shared";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { Avatar, IconButton } from "@chakra-ui/react";
import { FaEllipsis, FaTrash } from "react-icons/fa6";

export type PostContentProps = {
  post: PostDTO;
  handleDelete: () => void;
  isDeleting: boolean;
};

export const Content: React.FC<PostContentProps> = ({
  post,
  handleDelete,
  isDeleting
}) => {
  return (
    <>
      <Flex
        align="center"
        gap="1em"
        w="100%"
        // border="1px solid red"
      >
        <Avatar
          name="U N"
          // src="https://bit.ly/sage-adebayo"
          bg="background.600"
          color="brand.500"
        />
        <Box
          maxW="50%"
          textOverflow={"ellipsis"}
          whiteSpace="nowrap"
          overflow="hidden"
        >
          <Text as="span" color="text.100" textStyle="sm">
            @username
            {/* {post.creatorWallet} */}
          </Text>
        </Box>
        <Menu offset={[-105, -10]}>
          <MenuButton
            as={IconButton}
            variant="empty"
            color="text.400"
            aria-label="See menu."
            icon={<FaEllipsis fontSize="1.5rem" />}
            size="lg"
            isLoading={isDeleting}
            ml="auto"
          />
          <MenuList>
            <MenuItem
              onClick={handleDelete}
              // border="1px solid red"
              icon={<FaTrash color="red" />}
            >
              <Text as="span" color="red">
                Delete
              </Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Box>
        <Text color="text.100" textStyle="md">
          {post.text}
        </Text>
      </Box>
      {/* to add dateTime later */}
      <Text as="time" dateTime="" color="text.400" textStyle="sm">
        14:34 PM
        <Text as="span" fontSize="0.75em" whiteSpace="pre-wrap">
          {"    •    "}
        </Text>
        Jun 4, 2024
      </Text>
    </>
  );
};
