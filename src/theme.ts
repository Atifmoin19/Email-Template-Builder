import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    primary: {
      50: "#f7f2fa",
      100: "#eee4f5",
      200: "#ddc6ea",
      300: "#c9a1de",
      400: "#b472d2",
      500: "#9b02c5",
      600: "#8b02b0",
      700: "#780299",
      800: "#62017d",
      900: "#450158",
    },
    secondary: {
      50: "#f3f7f4",
      100: "#e5efe9",
      200: "#c9ded0",
      300: "#a7ccb5",
      400: "#7cb894",
      500: "#37a169",
      600: "#31905e",
      700: "#2b7d51",
      800: "#236642",
      900: "#19482f",
    },
  },
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
});
