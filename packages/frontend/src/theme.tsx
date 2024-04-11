import { background, extendTheme, textDecoration } from "@chakra-ui/react";
import "@fontsource/space-grotesk";

const fonts = {
  heading: `'Space Grotesk', sans-serif`
  // body: "cursive"
};

const styles = {
  global: {
    "html, body": {
      color: "colors.text.900",
      // lineHeight: "tall"
      boxSizing: "border-box"
    },
    body: {},
    html: {
      scrollBehavior: "smooth"
    },
    a: {
      textUnderlineOffset: "0.5em"
    }
  }
};

const colors = {
  colors: {
    brand: {
      600: "#26D695"
    },
    text: {
      100: "#FFFFFF",
      900: "#242424"
    },
    background: {
      900: "#242424"
    }
  }
};

const components = {
  Button: {
    // 1. We can update the base styles
    // baseStyle: {
    //   fontWeight: 'bold', // Normally, it is "semibold"
    // },
    // 2. We can add a new button size or extend existing
    sizes: {
      xs: {
        fontSize: "0.825rem",
        px: "1.5em",
        py: "0.5em"
      },
      md: {
        fontSize: "1.125rem",
        px: "1.5em",
        py: "0.5em"
      }
    },
    // 3. We can add a new visual variant
    variants: {
      primary: () => ({
        bg: "colors.brand.600",
        color: "colors.text.100",
        borderRadius: "3xl",
        fontWeight: 600,
        _loading: {
          _hover: {
            // grey?
            bg: "grey"
          }
        },
        _hover: {
          bg: "colors.background.900",
          color: "colors.text.100",
          _disabled: {
            // grey??
            bg: "grey"
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
  }
};

export const theme = extendTheme({ fonts, styles, colors, components });
