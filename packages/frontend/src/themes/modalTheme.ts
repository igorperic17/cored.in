import { modalAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(modalAnatomy.keys);

const baseStyle = definePartsStyle({
  dialogContainer: {
    px: "0.5em",
    py: "0.5em"
  },
  dialog: {
    py: "1em",
    px: "1em",
    bg: "#F1F1F0", // === "background.100"
    borderRadius: "1em",
    border: "1px solid #E6E6E6",
    color: "brand.900"
  },
  overlay: {
    bg: "#14141380",
    backdropFilter: "blur(2px)"
  }
});

export const modalTheme = defineMultiStyleConfig({ baseStyle });
