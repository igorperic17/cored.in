import { ROUTES } from "@/router/routes";
import { Avatar, Flex, Link, Text } from "@chakra-ui/react";
import { PostDTO } from "@coredin/shared";
import { FC } from "react";
import { Link as ReactRouterLink } from "react-router-dom";

type MessagePreviewCardProps = {
  initialMessage: PostDTO;
};

export const MessagePreviewCard: FC<MessagePreviewCardProps> = ({
  initialMessage
}) => {
  const messageUrl = ROUTES.USER.POST.buildPath(
    initialMessage.creatorWallet,
    initialMessage.id
  );

  return (
    <Link
      as={ReactRouterLink}
      to={messageUrl}
      _hover={{ textDecoration: "none" }}
    >
      <Flex
        as="article"
        gap="0.5em"
        direction="column"
        py="1em"
        //   border="2px solid"
        //   borderColor="brand.300"
        layerStyle="cardBox"
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
            name={initialMessage.creatorUsername}
            src={initialMessage.creatorAvatar}
            bg="brand.100"
            color={initialMessage.creatorAvatarFallbackColor || "brand.500"}
            border={initialMessage.creatorAvatar || "1px solid #b0b0b0"}
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
              {initialMessage.creatorUsername}
            </Text>
            <Text
              color="brand.900"
              textStyle="sm"
              //   border="1px solid blue"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {initialMessage.text}
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
          {new Date(initialMessage.createdAt).toLocaleTimeString()}
          <Text as="span" fontSize="0.75em" whiteSpace="pre-wrap">
            {"    •    "}
          </Text>
          {new Date(initialMessage.createdAt).toLocaleDateString()}
        </Text>
      </Flex>
    </Link>
  );
};
