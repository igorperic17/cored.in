import { Flex, Box, Text, VStack } from "@chakra-ui/layout";
import React from "react";
import { PostDTO } from "@coredin/shared";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { Avatar, IconButton } from "@chakra-ui/react";
import { FaEllipsis, FaTrash } from "react-icons/fa6";

export type PostContentProps = {
  post: PostDTO;
  handleDelete?: () => void;
  isDeleting?: boolean;
};

export const Content: React.FC<PostContentProps> = ({
  post,
  handleDelete,
  isDeleting
}) => {
  return (
    <>
      <Flex
        // align="center"
        gap="1.125em"
        w="100%"
        // border="1px solid red"
      >
        <Avatar
          name="U N"
          // src="https://bit.ly/sage-adebayo"
          bg="background.600"
          color="brand.500"
          size="md"
        />
        <VStack
          align="start"
          spacing="0.5em"
          w="100%"
          // border="1px solid yellow"
        >
          <Box
            maxW="300px"
            textOverflow={"ellipsis"}
            whiteSpace="nowrap"
            overflow="hidden"
          >
            <Text as="span" color="text.100" textStyle="md">
              @username
              {/* {post.creatorWallet} */}
            </Text>
          </Box>
          <Text color="text.100" textStyle="sm">
            {post.text}
          </Text>
          {/* to add dateTime later */}
          <Text as="time" dateTime="" color="text.400" textStyle="sm">
            14:34 PM
            <Text as="span" fontSize="0.75em" whiteSpace="pre-wrap">
              {"    •    "}
            </Text>
            Jun 4, 2024
          </Text>
        </VStack>
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
            mt="-0.5em"
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
    </>
  );
};
