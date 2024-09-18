import { defineStyleConfig } from "@chakra-ui/react";

const baseStyle = {
  borderRadius: "0.25em",
  fontSize: "0.875rem",
  fontWeight: "400",
  color: "brand.100",
  textAlign: "center"
};

export const tooltipTheme = defineStyleConfig({ baseStyle });
