import { Flex, Icon, Link } from "@chakra-ui/react";
import { FaXTwitter, FaDiscord } from "react-icons/fa6";

export const SocialMedia = () => (
  <Flex direction="row" justify="space-between" w="100%" maxW="180px">
    <Link href="https://twitter.com/cored_in" isExternal fontSize="3rem">
      <Icon
        as={FaXTwitter}
        _hover={{
          color: "brand.600"
        }}
      />
    </Link>
    <Link href="https://discord.gg/wMc5uCkr" isExternal fontSize="3rem">
      <Icon
        as={FaDiscord}
        _hover={{
          color: "brand.600"
        }}
      />
    </Link>
  </Flex>
)
