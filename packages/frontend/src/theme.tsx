import { extendTheme } from "@chakra-ui/react";
import "@fontsource/space-grotesk";
import "@fontsource/noto-sans";
import { inputTheme, stepperTheme } from "./themes";

const fonts = {
  heading: `'Space Grotesk', sans-serif`,
  body: `"Noto Sans", sans-serif`
};

const styles = {
  global: {
    "html, body": {
      color: "text.100",
      boxSizing: "border-box"
    },
    body: {
      background: "background.900"
    },
    html: {
      scrollBehavior: "smooth"
    },
    a: {
      textUnderlineOffset: "0.5em"
    },
    p: {
      fontSize: { base: "1rem", md: "1.25rem" },
      lineHeight: "1.35"
    }
  }
};

const colors = {
  brand: {
    500: "#7AF9B3" // green / main
  },
  complimentary: {
    500: "#1F45F3" // blue but not readable // do not use yet
  },
  text: {
    100: "#F1F1F0", // light - white / main text
    300: "#b0b0b0", // hover / text in the stepper
    400: "#828178", // medium / text on card
    600: "#737373", // - hover 2 / not in use yet
    700: "#75746B", // heading in profile
    800: "#62625D", // - medium - dark / not in use yet
    900: "#121111" // dark
  },
  background: {
    100: "#ebebeb", // - not in use yet
    600: "#3E3D3A", // card bg
    800: "#222320", // very dark bg / profile bg
    900: "#1C1C1A" // body bg / black
  }
};

const components = {
  Button: {
    // 1. We can update the base styles
    baseStyle: {
      //fontWeight: 'bold', // Normally, it is "semibold"
      textTransform: "uppercase"
    },
    sizes: {
      xs: {
        fontSize: { base: "0.75em", md: "0.825rem" }
      },
      md: {
        fontSize: "1.125rem",
        px: "1.5em",
        py: "0.5em",
        borderRadius: "3xl"
      },
      xl: {
        fontSize: "2rem",
        px: "1.5em",
        py: "0.5em",
        borderRadius: "2em"
      }
    },
    // 3. We can add a new visual variant
    variants: {
      primary: () => ({
        bg: "brand.500",
        color: "text.900",
        // borderRadius: "3xl",
        fontWeight: 600,
        _loading: {
          _hover: {
            bg: "background.100"
          }
        },
        _hover: {
          bg: "background.100",
          color: "text.900",
          _disabled: {
            bg: "background.100"
          }
        }
      })
      // secondary: () => ({
      //   border: "2px solid",
      //   borderColor:
      //     props.colorMode === "dark" ? "headingGrey" : "headingBlack",
      //   color: props.colorMode === "dark" ? "white" : "headingBlack",
      //   borderRadius: "3xl",
      //   fontWeight: 600,
      //   _hover: {
      //     bg: "headingBlack",
      //     color: "white"
      //   }
      // }
      // })
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
  Stepper: stepperTheme,
  Input: inputTheme
};

const breakpoints = {
  base: "0em", // 0px
  sm: "30em", // ~480px. em is a relative unit and is dependant on the font size.
  md: "48em", // ~768px
  lg: "62em", // ~992px
  xl: "80em", // ~1280px
  "2xl": "96em" // ~1536px
};

export const theme = extendTheme({
  fonts,
  styles,
  colors,
  components,
  breakpoints
});
