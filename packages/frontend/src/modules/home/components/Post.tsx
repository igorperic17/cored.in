import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Image,
  Text,
  VStack
} from "@chakra-ui/react";
import { FaComment, FaEllipsis, FaRegHeart, FaRetweet } from "react-icons/fa6";

export const Post = () => {
  return (
    <VStack
      as="article"
      align="start"
      spacing="2em"
      w="100%"
      maxW="450px"
      h="max-content"
      bg="background.800"
      borderRadius="0.5em"
      //   border="1px solid red"
      p="1.5em"
    >
      <Flex align="center" gap="1em" w="100%">
        <Avatar
          name="Natalia Davtyan"
          // src="https://bit.ly/sage-adebayo"
          bg="brand.500"
          color="text.900"
        />
        <Flex direction="column">
          <Text as="span">Natalia Davtyan</Text>
          <Text as="span">@nataliadi</Text>
        </Flex>
        <IconButton
          variant="empty"
          aria-label="See menu."
          color="inherit"
          alignSelf="start"
          // border="1px solid red"
          ml="auto"
          mt="-0.375em"
          icon={<FaEllipsis />}
        />
      </Flex>
      <Box>
        <Text>
          This is the first post (ever!) created in cored.in. And it doesn't
          matter that this is a test. Hi!
        </Text>
      </Box>
      <Flex w="100%" justify="space-around">
        <Button
          variant="empty"
          size="xs"
          color="text.100"
          leftIcon={<FaRegHeart />}
        >
          Like
        </Button>
        <Button
          variant="empty"
          size="xs"
          color="text.100"
          leftIcon={<FaComment />}
        >
          Comment
        </Button>
        <Button
          variant="empty"
          size="xs"
          color="text.100"
          leftIcon={<FaRetweet />}
        >
          Share
        </Button>
      </Flex>
    </VStack>
  );
};
