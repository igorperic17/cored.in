import { defineStyle, defineStyleConfig } from "@chakra-ui/react";

const verified = defineStyle({
  p: "0.25em 0.5em",
  border: "1px solid",
  borderColor: "brand.500",
  color: "brand.500",
  fontFamily: "body",
  fontWeight: "semibold"
});

export const badgeTheme = defineStyleConfig({
  variants: { verified }
});
