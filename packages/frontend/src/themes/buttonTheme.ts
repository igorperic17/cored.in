import { defineStyle, defineStyleConfig } from "@chakra-ui/system";

const baseStyle = defineStyle({
  textTransform: "uppercase"
});

const sizes = defineStyle({
  xs: {
    fontSize: { base: "0.75em", md: "0.875rem" },
    borderRadius: "0.375em",
    py: "0.25em",
    px: "0.5em"
  },
  sm: {
    fontSize: { base: "0.875rem", md: "1rem" },
    borderRadius: "0.375em",
    px: "1.5em",
    py: "0.5em"
  },
  md: {
    fontSize: { base: "1rem", md: "1.125rem" },
    px: "1.5em",
    py: "0.5em",
    borderRadius: "0.375em"
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
  color: "brand.100",
  fontWeight: "500",
  _hover: {
    bg: "brand.300",
    color: "brand.100",
    _disabled: {
      bg: "background.400",
      color: "brand.900"
    },
    _loading: {
      bg: "brand.300"
    }
  },
  _loading: {
    bg: "brand.300",
    opacity: "1"
  },
  _disabled: {
    bg: "background.400",
    color: "brand.900"
  }
});

const empty = defineStyle({
  border: "none",
  borderRadius: "0",
  color: "brand.300",
  px: "0",
  _hover: {
    color: "brand.300"
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
