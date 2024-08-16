import { checkboxAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const baseStyle = definePartsStyle({
  label: {
    fontFamily: "body"
  },
  control: {
    borderRadius: "2px",
    borderColor: "brand.100",
    borderWidth: "1px",
    p: 1,
    mr: "6px",
    _hover: {
      borderColor: "brand.300",
      _checked: {
        borderColor: "brand.100",
        bg: "brand.100"
      }
    },
    _checked: {
      bg: "brand.300",
      borderColor: "brand.300",
      color: "brand.900"
    }
  }
});

export const checkboxTheme = defineMultiStyleConfig({ baseStyle });
