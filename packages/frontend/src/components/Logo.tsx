import { Box, Text } from "@chakra-ui/react";
import { FC } from "react";

interface LogoProps {
  fontSize: { base?: string; md: string };
}

export const Logo: FC<LogoProps> = ({ fontSize }) => {
  return (
    <Text fontSize={fontSize} fontFamily="heading" fontWeight="700">
      cored
      <Text as="span" color="brand.500">
        .in
      </Text>
    </Text>
  );
};
