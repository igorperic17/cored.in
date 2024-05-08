import { Flex, Icon, Link } from "@chakra-ui/react";
import { FaXTwitter, FaDiscord } from "react-icons/fa6";

export const SocialMedia = () => (
  <Flex direction="row" justify="space-between" w="100%" maxW="150px">
    <Link href="https://twitter.com/cored_in" isExternal fontSize="3rem">
      <Icon
        as={FaXTwitter}
        _hover={{
          color: "brand.500"
        }}
      />
    </Link>
    <Link href="https://discord.gg/fhsyaEJ5VZ" isExternal fontSize="3rem">
      <Icon
        as={FaDiscord}
        _hover={{
          color: "brand.500"
        }}
      />
    </Link>
  </Flex>
);
