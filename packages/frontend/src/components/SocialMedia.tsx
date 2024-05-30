import { Flex, Icon, Link } from "@chakra-ui/react";
import { FC } from "react";
import { FaXTwitter, FaDiscord } from "react-icons/fa6";

type SocialMediaSize = {
  size: string;
  gap: string;
};

export const SocialMedia: FC<SocialMediaSize> = ({ size, gap }) => (
  <Flex direction="row" justify="center" gap={gap}>
    <Link href="https://twitter.com/cored_in" isExternal fontSize={size}>
      <Icon
        as={FaXTwitter}
        aria-label="X."
        _hover={{
          color: "brand.500"
        }}
      />
    </Link>
    <Link href="https://discord.gg/fhsyaEJ5VZ" isExternal fontSize={size}>
      <Icon
        as={FaDiscord}
        aria-label="Discord."
        _hover={{
          color: "brand.500"
        }}
      />
    </Link>
  </Flex>
);
