import { radioAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(radioAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  control: {
    borderRadius: "12px", // change the border radius
    borderColor: "brand.500", // change the border color,
    _checked: {
      borderColor: "brand.500",
      bg: "brand.500",
      color: "brand.500",
      _hover: {
        borderColor: "brand.500",
        bg: "brand.500"
      }
    }
  }
});

export const radioTheme = defineMultiStyleConfig({ baseStyle });
