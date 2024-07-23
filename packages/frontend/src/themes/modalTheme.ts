import { modalAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(modalAnatomy.keys);

const baseStyle = definePartsStyle({
  dialog: {
    bg: "background.700",
    color: "text.100"
  },
  overlay: {
    bg: "#000000CC"
  }
});

export const modalTheme = defineMultiStyleConfig({ baseStyle });
