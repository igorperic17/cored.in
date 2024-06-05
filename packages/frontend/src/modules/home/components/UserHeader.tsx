import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { useChain } from "@cosmos-kit/react";
import { TESTNET_CHAIN_NAME } from "@coredin/shared";
import { FaPen } from "react-icons/fa6";

export const UserHeader = () => {
  const chainContext = useChain(TESTNET_CHAIN_NAME);
  const isUserConnected = chainContext.isWalletConnected;
  // chainContext.isWalletConnected; // this shows if the user is connected

  return (
    <Box layerStyle="cardBox" w="100%">
      <Box
        h={{ base: "75px", lg: "125px" }}
        w="100%"
        bg="brand.500"
        borderTopRadius="inherit"
      ></Box>
      <Avatar
        name="U N"
        // src="https://bit.ly/sage-adebayo"
        bg="background.600"
        color="brand.500"
        size={{ base: "lg", lg: "2xl" }}
        mt="-1.25em"
        ml="0.5em"
        border="4px solid #1C1C1A"
      />
      <Flex direction="column" gap="1.5em" px="1.125em" pt="1.75em" pb="2.5em">
        <Flex justify="space-between">
          <Text as="span" color="text.100" textStyle="md">
            @username
            {/* {post.creatorWallet} */}
          </Text>
          <Button
            aria-label="Edit profile."
            variant="empty"
            size="sm"
            color="text.400"
            leftIcon={<FaPen size="0.875rem" />}
            mt={{ base: "-3rem", md: "-4.5rem" }}
          >
            <Text as="span" ml="0.375em">
              Edit
            </Text>
          </Button>
        </Flex>
        <Text textStyle="sm">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima
          corrupti atque optio eaque voluptas architecto quibusdam!
        </Text>
      </Flex>
    </Box>
  );
};
