import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const baseStyle = definePartsStyle({
  field: {
    color: "text.100",
    fontFamily: "body",
    fontSize: { base: "1rem", lg: "1.25rem" },
    textAlign: "start",
    _placeholder: {
      color: "text.700"
    }
  }
});

export const inputTheme = defineMultiStyleConfig({ baseStyle });
