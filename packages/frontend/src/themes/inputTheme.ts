import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const baseStyle = definePartsStyle({
  field: {
    color: "brand.900",
    fontFamily: "body",
    fontSize: { base: "0.875rem", lg: "1rem" },
    textAlign: "start",
    borderRadius: "1.125em",

    _placeholder: {
      color: "other.600"
    }
  }
});

export const inputTheme = defineMultiStyleConfig({ baseStyle });
