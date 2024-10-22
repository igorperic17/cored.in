import { Avatar, Flex, Link, Text } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";

// TODO: adapt the styling for when we get the notification working (similar to MessagePreviewCard)
export const TipsNotificationCard = () => {
  return (
    <Link
      as={ReactRouterLink}
      //   to={messageUrl}
      w="100%"
      _hover={{ textDecoration: "none" }}
    >
      <Flex
        as="article"
        gap="0.5em"
        direction="column"
        py="1em"
        border={
          "1px solid #E6E6E6"
          //   initialMessage.unread ? "2px solid #00AA54" : "1px solid #E6E6E6"
        }
        layerStyle="cardBox"
        // w="100%"
        _hover={{
          bg: "brand.100"
        }}
      >
        <Flex
          gap={{ base: "0.75em", sm: "1.125em" }}
          //   border="1px solid red"
          //
        >
          <Avatar
            name={
              "Username"
              //   isInitialisedByMe
              //     ? initialMessage.recipients?.[0].username
              //     : initialMessage.creatorUsername
            }
            src={
              ""
              //   isInitialisedByMe
              //     ? initialMessage.recipients?.[0].avatarUrl
              //     : initialMessage.creatorAvatar
            }
            bg="brand.100"
            color={
              "brand.300"
              //   isInitialisedByMe
              //     ? initialMessage.recipients?.[0].creatorFallbackColor
              //     : initialMessage.creatorAvatarFallbackColor || "brand.500"
            }
            border={
              "1px solid #b0b0b0"
              //   isInitialisedByMe
              //     ? initialMessage.recipients?.[0].avatarUrl ||
              //       "1px solid #b0b0b0"
              //     : initialMessage.creatorWallet !== chainContext.address
              //       ? initialMessage.creatorAvatar || "1px solid #b0b0b0"
              //       : "1px solid #b0b0b0"
            }
            size={{ base: "sm", sm: "md" }}
          />
          <Flex
            direction="column"
            // align="start"
            // border="1px solid red"
            w="100%"

            //
          >
            <Text as="span" color="brand.900" textStyle="md">
              <Text as="span" fontWeight="700">
                {`${"username"} `}
              </Text>
              tipped you
              {
                //   isInitialisedByMe
                //     ? initialMessage.recipients?.[0].username
                //     : initialMessage.creatorUsername
              }
              <Text as="span" fontWeight="700">{` ${10} CORE`}</Text>
            </Text>
            <Text
              as="time"
              dateTime=""
              color="other.600"
              textStyle="sm"
              userSelect="none"
            >
              {/* {new Date(initialMessage.createdAt).toLocaleTimeString()}
          <Text as="span" fontSize="0.75em" whiteSpace="pre-wrap">
            {"    •    "}
          </Text>
          {new Date(initialMessage.createdAt).toLocaleDateString()} */}
              13:05:33
              <Text as="span" fontSize="0.75em" whiteSpace="pre-wrap">
                {"    •    "}
              </Text>
              21/10/2024
            </Text>
          </Flex>
        </Flex>

        {/* TODO: add post preview here */}
      </Flex>
    </Link>
  );
};
