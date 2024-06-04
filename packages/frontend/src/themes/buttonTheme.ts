import { defineStyle, defineStyleConfig } from "@chakra-ui/system";

const baseStyle = defineStyle({
  textTransform: "uppercase"
});

const sizes = defineStyle({
  xs: {
    fontSize: { base: "0.75em", md: "0.825rem" }
  },
  md: {
    fontSize: { base: "1rem", md: "1.125rem" },
    px: "1.5em",
    py: "0.5em",
    borderRadius: "3xl"
  },
  xl: {
    fontSize: "2rem",
    px: "1.5em",
    py: "0.5em",
    borderRadius: "2em"
  }
});

const primary = defineStyle({
  bg: "brand.500",
  color: "text.900",
  fontWeight: 600,
  _loading: {
    _hover: {
      bg: "background.100"
    }
  },
  _hover: {
    bg: "background.100",
    color: "text.900",
    _disabled: {
      bg: "background.100"
    }
  }
});

const empty = defineStyle({
  border: "none",
  borderRadius: "0",
  color: "brand.500",
  px: "0",
  _hover: {
    color: "text.100"
  }
  // _focus: {
  //   color: "text.100"
  // }
});

export const buttonTheme = defineStyleConfig({
  baseStyle,
  sizes,
  variants: { primary, empty }
});
