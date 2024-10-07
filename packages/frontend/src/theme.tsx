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
  textStyles,
  tooltipTheme
} from "./themes";

const fonts = {
  heading: `'Public Sans Variable', sans-serif`,
  body: `'Public Sans Variable', sans-serif`
};

const colors = {
  brand: {
    100: "#F5F5F5", // white
    200: "#FBB030", // yellow
    300: "#00AA54", // green
    400: "#FF550F", // red
    500: "#7F02FE", // purple
    900: "#141413"
  },
  text: {
    100: "#F1F1F0", // light - white / main text
    300: "#b0b0b0", // USED IN LOGIN, HELPER TEXT *
    400: "#828178", // medium / text on card
    600: "#737373", // - hover 2 / not in use yet
    700: "#75746B", // PLEACEHOLDER and SIGN OUT BUTTON *
    800: "#62625D", // - medium - dark / not in use yet
    900: "#121111" // dark
  },
  background: {
    100: "#F5F5F5", // body bg
    400: "#828178", /// === text.400
    600: "#3E3D3A", // card bg
    700: "#272723",
    800: "#222320", // very dark bg / profile bg
    900: "#141413" // body bg / black // FLOC
  }
};

const styles = {
  global: {
    "::-webkit-scrollbar": {
      width: "10px"
    },
    "::-webkit-scrollbar-thumb": {
      bg: "#FFFFFFBF",
      border: "1px solid #141413",
      borderRadius: "8px"
    },
    "::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "brand.200"
    },
    "html, body": {
      color: "text.900",
      boxSizing: "border-box"
    },
    body: {
      background: "brand.100"
    },
    html: {
      scrollBehavior: "smooth"
    },
    a: {
      textUnderlineOffset: "0.25em",
      _hover: { color: "brand.300" }
    },
    p: {}
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
  Tabs: tabsTheme,
  Tooltip: tooltipTheme
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
