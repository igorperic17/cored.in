import { StyleFunctionProps, extendTheme } from "@chakra-ui/react";

import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const baseStyle = definePartsStyle({
  // define the part you're going to style
  field: {
    // fontFamily: "mono", // change the font family
    // color: "red" // change the input text color
    p: "1.5em",
    size: "1rem",
    mb: "1em"
  }
  // track: {
  //   bg: "red.500",
  //   _checked: {
  //     bg: "red.500"
  //   }
  // }
});

export const inputTheme = defineMultiStyleConfig({ baseStyle });

// Extend the theme to include custom colors, fonts, etc - see https://chakra-ui.com/docs/styled-system/customize-theme for reference!
const colors = {
  mainBlue: "#0c042f",
  textLight: "#6F6F6F",
  textExtraLight: "#a8a8a8",
  test: "red",
  // old bglight used to be #f6f6f6
  bglight: "#f9f9f9",
  // prev version of bgmedium:
  // bgmedium: "#e6e6e6",
  bgmedium: "#f4f4f4",
  bgmediumscheme: {
    // 500: "#f4f4f4"
    500: "red"
  },
  bgdark: "#BDBDBD",
  accent: "grey",
  // bgdark does not work. I changed it to the HEX equivalent to grey.400
  // bgdark: "grey.400",
  headingBlack: "#1E1E1E", // "#07021d", // Bluer black used for the logo
  headingGrey: "#70757E",
  tabGray: {
    500: "#f4f4f4"
  },
  coredin: {
    light: "#76f5db",
    500: "#76f5db",
    lightOnHover: "#15efc3",
    dark: "teal.600",
    700: "#2a69ac"
  }
};

const fonts = {
  body: "system-ui, sans-serif",
  // heading: "Georgia, serif",
  heading: "system-ui, sans-serif",
  mono: "Menlo, monospace"
};

const styles = {
  global: {
    // styles for the `body`
    body: {
      // bg: "gray.400",
      // textColor: "text",
      // color: "text"
    }
    // styles for the `a`
    // a: {
    //   color: 'teal.500',
    //   _hover: {
    //     textDecoration: 'underline',
    //   },
    // },
  }
};

const components = {
  Input: inputTheme,
  Button: {
    // 1. We can update the base styles
    // baseStyle: {
    //   fontWeight: 'bold', // Normally, it is "semibold"
    // },
    // 2. We can add a new button size or extend existing
    // sizes: {
    //   xl: {
    //     h: '56px',
    //     fontSize: 'lg',
    //     px: '32px',
    //   },
    // },
    // 3. We can add a new visual variant
    variants: {
      rounded: (props: StyleFunctionProps) => ({
        bg: props.colorMode === "dark" ? "bgdark" : "headingBlack",
        color: props.colorMode === "dark" ? "headingBlack" : "white",
        borderRadius: "3xl",
        fontWeight: 600,
        _loading: {
          _hover: {
            bg: props.colorMode === "dark" ? "bgdark" : "headingBlack"
          }
        },
        _hover: {
          bg: "coredin.light",
          color: "headingBlack",
          _disabled: {
            bg: props.colorMode === "dark" ? "grey" : "grey"
          }
        }
      }),
      secondary: (props: StyleFunctionProps) => ({
        // bg: props.colorMode === "dark" ? "headingGrey" : "headingGrey",
        // bg: "red",
        border: "2px solid",
        borderColor:
          props.colorMode === "dark" ? "headingGrey" : "headingBlack",
        // switch the colors
        // color: props.colorMode === "dark" ? "headingBlack" : "white",
        color: props.colorMode === "dark" ? "white" : "headingBlack",
        borderRadius: "3xl",
        fontWeight: 600,
        // _loading: {
        _hover: {
          bg: "headingBlack",
          color: "white"
          // bg: props.colorMode === "dark" ? "bgdark" : "headingBlack"
        }
        // }
      })
      // 'with-shadow': {
      //   bg: 'teal.400',
      //   boxShadow: '0 0 2px 2px #efdfde',
      // },
      // 4. We can override existing variants
      // solid: (props: StyleFunctionProps) => ({
      //   bg: props.colorMode === 'dark' ? 'blue.300' : 'teal.500',
      // }),
      // 5. We can add responsive variants
      // sm: {
      //   bg: 'teal.500',
      //   fontSize: 'md',
      // },
    }
    // 6. We can overwrite defaultProps
    // defaultProps: {
    //   size: 'lg', // default is md
    //   variant: 'sm', // default is solid
    //   colorScheme: 'blue', // default is gray
    // },
  },

  //
  Checkbox: {
    parts: ["control"],
    baseStyle: {
      control: {
        alignSelf: "start",
        mt: "1",
        mr: "1",
        p: 2,
        borderRadius: "2px",
        borderColor: "bgdark",
        borderWidth: "2px",

        _hover: {
          borderColor: "coredin.light",
          _checked: {
            bg: "bglight",
            borderColor: "coredin.light",
            bordreColor: "black"
          }
        },
        _checked: {
          bg: "bglight",
          // borderColor: "bgmedium",
          borderColor: "black",
          color: "black"
        }
      }
    }
  }
};

export const theme = extendTheme({ colors, fonts, components, styles });
