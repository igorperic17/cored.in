import { background, extendTheme } from "@chakra-ui/react";
import "@fontsource/space-grotesk";

const fonts = {
  heading: `'Space Grotesk', sans-serif`
  // body: "cursive"
};

const styles = {
  global: {
    "html, body": {
      // color: "gray.600",
      // lineHeight: "tall"
      boxSizing: "border-box"
    },
    body: {},
    html: {
      scrollBehavior: "smooth"
    },
    a: {
      color: "teal.500"
    }
  }
};

const colors = {
  colors: {
    brand: {
      600: ""
    },
    text: {},
    background: {}
  }
};

export const theme = extendTheme({ fonts, styles, colors });
