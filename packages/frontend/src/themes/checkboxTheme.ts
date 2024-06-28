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
    borderColor: "background.400",
    borderWidth: "1px",
    p: 1,
    mr: "6px",
    _hover: {
      borderColor: "brand.500",
      _checked: {
        borderColor: "background.400",
        bg: "background.400"
      }
    },
    _checked: {
      bg: "brand.500",
      borderColor: "brand.500",
      color: "text.900"
    }
  }
});

export const checkboxTheme = defineMultiStyleConfig({ baseStyle });
