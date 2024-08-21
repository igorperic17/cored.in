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
    color: "text.300"
  },
  tab: {
    bg: "background.900",
    border: "1px solid #292929",
    backdropFilter: "blur(12px)",
    borderTopRadius: "0.5em",
    _selected: {
      color: "brand.200",
      borderBottom: "none"

      // bg: "background.700"
    },
    _hover: {
      color: "text.100",
      _selected: {
        color: "brand.200"
      }
    }
  },
  tabPanels: {
    // bg: "red",
    // borderColor: "yellow"
    // border: "1px solid #292929",
    // bg: "red"
  },
  tabpanel: {
    p: "0",
    borderBottomRadius: "0.5em",
    border: "1px solid #292929",
    bg: "#121111BF",
    backdropFilter: "blur(12px)"
    // _selected: {
    //   borderTop: "none"
    // }
    // border: "1px solid #141413",
    // bg: ""
  }
});

export const tabsTheme = defineMultiStyleConfig({ baseStyle, sizes });
