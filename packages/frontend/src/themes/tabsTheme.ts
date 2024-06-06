import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

const sizes = {
  md: definePartsStyle({
    tab: {
      fontSize: { base: "1rem", lg: "1.25rem" },
      py: "0.75em"
    }
  })
};

const baseStyle = definePartsStyle({
  tablist: {
    color: "text.400"
  },
  tab: {
    bg: "background.800",
    _selected: {
      color: "brand.500",
      bg: "background.700"
    }
  }
});

export const tabsTheme = defineMultiStyleConfig({ baseStyle, sizes });
