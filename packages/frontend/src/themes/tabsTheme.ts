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
  tablist: {
    color: "text.400"
  },
  tab: {
    bg: "background.900",
    borderTopRadius: "0.5em",
    _selected: {
      color: "brand.500",
      bg: "background.700"
    },
    _hover: {
      color: "text.100",
      _selected: {
        color: "brand.500"
      }
    }
  },
  tabpanel: {
    p: "0",
    borderBottomRadius: "0.5em",
    bg: "background.700"
  }
});

export const tabsTheme = defineMultiStyleConfig({ baseStyle, sizes });
