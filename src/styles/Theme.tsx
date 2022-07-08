import React from "react";

// material ui
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { argbFromHex, customColor } from "@material/material-color-utilities";

let theme = createTheme();

// key colors and theme
theme = createTheme(theme, {
  palette: {
    primary: {
      main: "#f39200",
    },
    secondary: {
      main: "#4fc1ea",
    },
    background: {
      default: "rgb(249, 249, 249)",
      paper: "#fff",
    },
    text: {
      primary: "#363636",
      secondary: "#999999",
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export const activeColor = customColor(0, {
  value: argbFromHex(theme.palette.primary.main),
  name: "active",
  blend: false,
});

theme = responsiveFontSizes(theme);

theme = createTheme(theme, {
  components: {
    MuiPopover: {
      defaultProps: {
        elevation: 2,
      },
      styleOverrides: {
        paper: {
          paddingLeft: 0,
          paddingRight: 0,
          borderRadius: "4px",
        },
      },
    },
    MuiDialog: {
      defaultProps: {
        PaperProps: {
          elevation: 3,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderStyle: "hidden",
          backgroundColor: theme.palette.background.default,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: theme.palette.text.primary,
          "&:hover": {
            color: theme.palette.primary.main,
          },
        },
      },
    },
  },
});

interface ITheme {
  children?: JSX.Element;
}

function Theme({ children }: ITheme) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default Theme;
