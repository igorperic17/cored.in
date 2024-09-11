import { AutoResizeTextarea } from "@/components";
import { ROUTES } from "@/router/routes";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button, Flex, Icon, Link, Text } from "@chakra-ui/react";
import { FC } from "react";
import { Link as ReactRouterLink, useParams } from "react-router-dom";
import { ChatMessage } from ".";
import { FaArrowUp } from "react-icons/fa6";
import { useChatScroll } from "../hooks";
import { PostDetailDTO } from "@coredin/shared";

type ChatProps = {
  chatWithUsername: string;
  message: PostDetailDTO;
};

export const Chat: FC<ChatProps> = ({ chatWithUsername, message }) => {
  const conversation = [message, ...message.replies];
  const ref = useChatScroll(conversation);
  const { wallet } = useParams();

  console.log("conversation", conversation);

  return (
    <Flex
      layerStyle="cardBox"
      p="1em"
      direction="column"
      gap="1em"
      h={{ base: "72dvh", sm: "78dvh", lg: "91vh" }}
      //   border="1px solid red"
    >
      <Flex justify="space-between" align="center">
        <Link
          as={ReactRouterLink}
          to={ROUTES.MESSAGES.path}
          _hover={{ textDecoration: "none" }}
        >
          <Icon as={ArrowBackIcon} />
        </Link>
        <Link
          as={ReactRouterLink}
          //   to={ROUTES.USER.buildPath} // TODO: add user path
          _hover={{ textDecoration: "none" }}
        >
          <Text as="span">{chatWithUsername}</Text>
        </Link>
      </Flex>
      <Flex
        ref={ref}
        as="section"
        direction="column"
        gap="0.5em"
        layerStyle="cardBox"
        p="1em"
        pb="0"
        h="100%"
        overflow="auto"
      >
        {conversation.map((message) => (
          <ChatMessage
            key={message.id}
            messageText={message.text}
            isMyOwnMessage={message.creatorWallet === wallet ? true : false}
            createdAt={message.createdAt}
          />
        ))}
      </Flex>
      <Flex
        gap="0.75em"
        // border="1px solid green"
        //
      >
        <AutoResizeTextarea maxH="160px" />
        <Button
          variant="primary"
          size="sm"
          h="100%"
          // onClick={handlePost}
          // isLoading={isLoading}
          // isDisabled={!postContent}
          aria-label="post"
          px="0"
        >
          <Icon as={FaArrowUp} />
        </Button>
      </Flex>
    </Flex>
  );
};
