import { modalAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(modalAnatomy.keys);

const baseStyle = definePartsStyle({
  dialogContainer: {
    px: "0.5em"
  },
  dialog: {
    py: "1em",
    px: "1em",
    borderRadius: "0.75em",
    bg: "#000000CC",
    border: "1px solid #292929",
    boxShadow: "0px 4px 4px 0px #00000014",
    backdropFilter: "blur(12px)",
    color: "brand.100"
  },
  overlay: {
    bg: "#14141380",
    backdropFilter: "blur(2px)"
  }
});

export const modalTheme = defineMultiStyleConfig({ baseStyle });
