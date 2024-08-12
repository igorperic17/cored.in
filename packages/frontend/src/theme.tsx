import { extendTheme } from "@chakra-ui/react";
import "@fontsource-variable/public-sans";
import {
  badgeTheme,
  buttonTheme,
  checkboxTheme,
  inputTheme,
  layerStyles,
  menuTheme,
  modalTheme,
  radioTheme,
  selectTheme,
  stepperTheme,
  tabsTheme,
  textStyles
} from "./themes";

const fonts = {
  heading: `'Public Sans Variable', sans-serif`,
  body: `'Public Sans Variable', sans-serif`
};

const styles = {
  global: {
    "::-webkit-scrollbar": {
      width: "12px",
      backgroundColor: "background.800"
    },
    "::-webkit-scrollbar-thumb": {
      backgroundColor: "background.600",
      borderRadius: "6px"
    },
    "::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "background.100"
    },
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
    p: textStyles.md
  }
};

const colors = {
  brand: {
    100: "#F5F5F5", // white
    300: "#FBB030", //yellow
    400: "#FF550F", // red
    500: "#7F02FE" // purple
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
    400: "#828178", /// === text.400
    600: "#3E3D3A", // card bg
    700: "#272723",
    800: "#222320", // very dark bg / profile bg
    900: "#1C1C1A" // body bg / black
  }
};

const components = {
  Badge: badgeTheme,
  Button: buttonTheme,
  Checkbox: checkboxTheme,
  Input: inputTheme,
  Menu: menuTheme,
  Modal: modalTheme,
  Radio: radioTheme,
  Select: selectTheme,
  Stepper: stepperTheme,
  Tabs: tabsTheme
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
  breakpoints,
  layerStyles,
  textStyles
});
