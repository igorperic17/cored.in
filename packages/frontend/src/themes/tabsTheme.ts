import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { textStyles } from "./textStyles";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

const sizes = {
  md: definePartsStyle({
    tab: {
      ...textStyles.md,
      py: "0.75em"
    }
  })
};

const baseStyle = definePartsStyle({
  tab: {
    bg: "#FFFFFFBF",
    backdropFilter: "blur(12px)",
    borderTopRadius: "1em",
    borderBottom: "1px solid #E6E6E6",
    _selected: {
      color: "brand.500",
      border: "1px solid #E6E6E6",
      borderBottom: "none",
      bg: "#FFFFFFBF"
    },
    _hover: {
      color: "brand.300",
      _selected: {
        color: "brand.500"
      }
    }
  },

  tabpanel: {
    px: "1em",
    py: "1.5em",
    border: "1px solid #E6E6E6",
    borderTop: "0",
    borderTopRadius: "0",
    borderBottomRadius: "1em",
    bg: "#FFFFFFBF",
    backdropFilter: "blur(12px)"
  }
});

export const tabsTheme = defineMultiStyleConfig({ baseStyle, sizes });
