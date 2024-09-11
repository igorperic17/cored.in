import { Box, Heading, VStack } from "@chakra-ui/react";
import { MessagePreviewCard } from "../components";
import { useLoggedInServerState } from "@/hooks";
import { FEED_QUERIES } from "@/queries/FeedQueries";

const MessagesPage = () => {
  const { data: messages } = useLoggedInServerState(FEED_QUERIES.getMessages());

  return (
    <VStack spacing="0.5em" w="100%" layerStyle="cardBox">
      <Heading
        as="h1"
        fontFamily="body"
        mb="1em"
        color="brand.900"
        alignSelf="start"
      >
        Messages
      </Heading>
      <VStack as="ul" spacing="0.5em" w="100%">
        {messages &&
          messages.map((message) => (
            <Box
              as="li"
              w="100%"
              key={`message-${message.creatorUsername}-${message.createdAt}`}
            >
              <MessagePreviewCard initialMessage={message} />
            </Box>
          ))}
      </VStack>
    </VStack>
  );
};

export default MessagesPage;
