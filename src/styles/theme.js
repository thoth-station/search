import { createTheme } from "@material-ui/core/styles";

export const themeLight = createTheme({
  palette: {
    background: {
      default: "#f9f9f9"
    },
    primary: {
      light: "#f5a733",
      main: "#f39200",
      dark: "#aa6600"
    },
    secondary: {
      light: "#72cdee",
      main: "#4fc1ea",
      dark: "#3787a3"
    },
    text: {
      priamry: "#363636",
      secondary: "#999"
    }
  },
  typography: {
    fontFamily: ["open sans", "sans-serif"],
    h6: {
      fontWeight: 600,
      fontSize: "1.2rem",
      color: "#444f60",
      lineHeight: 1.5
    },
    h4: {
      fontWeight: 600,
      fontSize: "2rem",
      color: "##363636",
      lineHeight: 1.125
    }

    // body2: {
    //   fontWeight: 400,
    //   fontSize: "0.875rem",
    //   lineHeight: 1.43
    // },
    //
    // button: {
    //   fontFamily: ["Roboto", "Helvetica", "Arial", "sans-serif"],
    //   fontWeight: 500,
    //   fontSize: "0.875rem",
    //   lineHeight: 1.75,
    //   letterSpacing: "0.02857em",
    //   textTransform: "uppercase"
    // }
  }
});
