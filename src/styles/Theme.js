import React from "react";

// material ui
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles'


import PropTypes from "prop-types";


const themeLight = createTheme({
    palette: {
        background: {
            default: "#f9f9f9",
        },
        primary: {
            light: "#f5a733",
            main: "#f39200",
            dark: "#aa6600",
        },
        secondary: {
            light: "#72cdee",
            main: "#4fc1ea",
            dark: "#3787a3",
        },
        text: {
            priamry: "#363636",
            secondary: "#999",
        },
    },
    typography: {
        fontFamily: ["open sans", "sans-serif"],
        h4: {
            fontWeight: 700,
            fontSize: "3rem",
            color: "#363636",
            lineHeight: 1.125,
        },
        h5: {
            fontWeight: 600,
            fontSize: "2rem",
            lineHeight: 1.125,
            color: "#363636",
        },
        h6: {
            fontWeight: 600,
            fontSize: "1.2rem",
            color: "#444f60",
            lineHeight: 1.5,
        },

        body1: {
            fontWeight: 400,
            fontSize: "1.25rem",
            lineHeight: 1.25,
            color: "#000",
        },

        body2: {
            fontWeight: 400,
            fontSize: "1rem",
            lineHeight: 1.5,
            color: "#000",
        },
        subtitle1: {
            fontWeight: 400,
            fontSize: "1.25rem",
            lineHeight: 1.25,
            color: "#999",
        },

        subtitle2: {
            fontWeight: 400,
            fontSize: "1rem",
            lineHeight: 1.5,
            color: "#999",
        },
    },
});

function Theme({ children }) {
    return (
        <ThemeProvider theme={themeLight}>
            {children}
        </ThemeProvider>
    );
}

Theme.propTypes = {
    children: PropTypes.node,
};

export default Theme;
