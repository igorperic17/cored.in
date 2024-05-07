import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style

  field: {
    // fontFamily: 'mono', // change the font family

    color: "text.100", // change the input text color
    fontFamily: "body",
    fontSize: { base: "1.25rem", md: "1.75rem" },
    textAlign: "center",
    py: "24px",
    _placeholder: {
      color: "text.700"
    }
  }
});

export const inputTheme = defineMultiStyleConfig({ baseStyle });
