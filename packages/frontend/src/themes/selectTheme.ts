import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const baseStyle = definePartsStyle({
  field: {
    color: "text.100",
    fontFamily: "body",
    fontSize: { base: "0.875rem", lg: "1rem" },
    textAlign: "start"
  }
});

export const selectTheme = defineMultiStyleConfig({ baseStyle });
