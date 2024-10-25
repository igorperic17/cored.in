import { Text, TextProps } from "@chakra-ui/layout";
import { FC } from "react";

type DisclaimerTextProps = TextProps & {
  size?: "xs" | "sm";
};

export const DisclaimerText: FC<DisclaimerTextProps> = ({
  size = "sm",
  ...props
}) => {
  return (
    <Text color="other.600" textStyle={size} {...props}>
      The official launch of cored.in is set for December 2024. The current
      version is for testing only, and all data, including profiles and posts,
      will be cleared before launch. The token will switch from TESTCORE to CORE
      upon release. We encourage you to explore and provide feedback on Discord.
    </Text>
  );
};
