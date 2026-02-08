import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-theme",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#635bff",
        },
        background: {
          default: "#ffffff",
          paper: "#f9f8f7",
        },
        text: {
          primary: "#30313d",
          secondary: "#6a7383",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#7c75ff",
        },
        background: {
          default: "#0a0a0c",
          paper: "#161618",
        },
        text: {
          primary: "#f5f5f7",
          secondary: "#a1a1aa",
        },
      },
    },
  },

  shape: {
    borderRadius: 10,
  },
});

export default theme;
