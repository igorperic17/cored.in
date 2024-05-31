import { menuAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

const baseStyle = definePartsStyle({
  button: {},
  list: {
    bg: "background.900",
    borderColor: "background.600",
    borderRadius: "0.5em",
    minW: "150px",
    w: "max-content"
  },
  item: {
    bg: "inherit",
    _hover: { bg: "background.700" },
    _focus: { bg: "background.700" }
  }
});

export const menuTheme = defineMultiStyleConfig({ baseStyle });
