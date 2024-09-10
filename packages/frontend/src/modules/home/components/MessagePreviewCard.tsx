import { Avatar, Flex, Text } from "@chakra-ui/react";
import { PostDTO } from "@coredin/shared";
import { FC } from "react";

type MessagePreviewCardProps = {
  lastMessage: PostDTO;
};

export const MessagePreviewCard: FC<MessagePreviewCardProps> = ({
  lastMessage
}) => {
  return (
    <Flex
      gap="0.5em"
      direction="column"
      py="1em"
      //   border="2px solid"
      //   borderColor="brand.300"
      layerStyle="cardBox"
      cursor="pointer"
      _hover={{
        bg: "text.100"
      }}
    >
      <Flex
        gap={{ base: "0.75em", sm: "1.125em" }}
        // border="1px solid red"
        //
      >
        <Avatar
          name={lastMessage.creatorUsername}
          src={lastMessage.creatorAvatar}
          bg="brand.100"
          color={lastMessage.creatorAvatarFallbackColor || "brand.500"}
          border={lastMessage.creatorAvatar || "1px solid #b0b0b0"}
          size={{ base: "sm", sm: "md" }}
        />
        <Flex
          direction="column"
          //   border="1px solid red"
          w="100%"
          maxW="82%"
          //
        >
          <Text as="span" color="brand.900" textStyle="md">
            {lastMessage.creatorUsername}
          </Text>
          <Text
            color="brand.900"
            textStyle="sm"
            //   border="1px solid blue"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {lastMessage.text}
          </Text>
        </Flex>
      </Flex>
      <Text
        as="time"
        dateTime=""
        color="text.700"
        textStyle="sm"
        ml={{ base: "3.125em", sm: "4.125em" }}
      >
        {new Date(lastMessage.createdAt).toLocaleTimeString()}
        <Text as="span" fontSize="0.75em" whiteSpace="pre-wrap">
          {"    •    "}
        </Text>
        {new Date(lastMessage.createdAt).toLocaleDateString()}
      </Text>
    </Flex>
  );
};
