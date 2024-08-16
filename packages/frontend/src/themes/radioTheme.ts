import { radioAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(radioAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  control: {
    borderRadius: "50%", // change the border radius
    borderColor: "brand.200", // change the border color,
    _checked: {
      borderColor: "brand.200",
      bg: "transparent",
      color: "brand.200",
      _hover: {
        borderColor: "brand.200",
        bg: "brand.200"
      }
    }
  }
});

export const radioTheme = defineMultiStyleConfig({ baseStyle });
