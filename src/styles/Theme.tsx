import React from "react";

// material ui
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { SimplePaletteColorOptions } from "@mui/material/styles/createPalette";
import {
    argbFromHex,
    hexFromArgb,
    Scheme,
    themeFromSourceColor,
} from "@material/material-color-utilities";
import * as Color from "color";

const md_theme = themeFromSourceColor(argbFromHex("#f39200"), [
    {
        name: "warning",
        value: argbFromHex("#ed6c02"),
        blend: true,
    },
    {
        name: "info",
        value: argbFromHex("#0288d1"),
        blend: true,
    },
    {
        name: "success",
        value: argbFromHex("#2e7d32"),
        blend: true,
    },
]);
let theme = createTheme();
const md_colors: ReturnType<typeof Scheme.prototype.toJSON> =
    md_theme.schemes[theme.palette.mode].toJSON();

const mui_palette: { [key: string]: SimplePaletteColorOptions } = {};

const addToPalette = (
    k: string,
    v: number,
    color_list: { [x: string]: number },
) => {
    if (k.startsWith("on") || k === "background") {
        return;
    }
    const text_key = ("on" +
        k.charAt(0).toUpperCase() +
        k.slice(1)) as keyof typeof color_list;
    const text_color = color_list?.[text_key];

    mui_palette[k] = {
        main: hexFromArgb(v),
        contrastText: text_color ? hexFromArgb(text_color) : undefined,
    };
};

Object.entries(md_colors).forEach(([k, v]) => addToPalette(k, v, md_colors));

md_theme.customColors.forEach(custom => {
    const group: { [key: string]: number } = {};
    Object.entries(custom[theme.palette.mode]).forEach(([k, v]) => {
        let new_key = k.replace("color", custom.color.name);
        new_key = new_key.replace(
            "Color",
            custom.color.name.charAt(0).toUpperCase() +
                custom.color.name.slice(1),
        );
        group[new_key] = v;
    });

    Object.entries(group).forEach(([k, v]) => addToPalette(k, v, group));
});

declare module "@mui/material/styles" {
    interface Palette {
        primaryContainer: SimplePaletteColorOptions;
        secondaryContainer: SimplePaletteColorOptions;
        tertiary: SimplePaletteColorOptions;
        tertiaryContainer: SimplePaletteColorOptions;
        errorContainer: SimplePaletteColorOptions;
        surface: SimplePaletteColorOptions;
        surfaceVariant: SimplePaletteColorOptions;
        outline: SimplePaletteColorOptions;
        shadow: SimplePaletteColorOptions;
        inverseSurface: SimplePaletteColorOptions;
        inverseOnSurface: SimplePaletteColorOptions;
        inversePrimary: SimplePaletteColorOptions;
    }
    interface PaletteOptions {
        primaryContainer?: SimplePaletteColorOptions;
        secondaryContainer?: SimplePaletteColorOptions;
        tertiary?: SimplePaletteColorOptions;
        tertiaryContainer?: SimplePaletteColorOptions;
        errorContainer?: SimplePaletteColorOptions;
        surface?: SimplePaletteColorOptions;
        surfaceVariant?: SimplePaletteColorOptions;
        outline?: SimplePaletteColorOptions;
        shadow?: SimplePaletteColorOptions;
        inverseSurface?: SimplePaletteColorOptions;
        inverseOnSurface?: SimplePaletteColorOptions;
        inversePrimary?: SimplePaletteColorOptions;
    }
}

// key colors and theme
theme = createTheme(theme, {
    palette: {
        ...mui_palette,
        background: {
            default: Color.default(hexFromArgb(md_colors.surface))
                .mix(Color.default(hexFromArgb(md_colors.primary)), 0.05)
                .hex(),
            paper: Color.default(hexFromArgb(md_colors.surface))
                .mix(Color.default(hexFromArgb(md_colors.primary)), 0.05)
                .hex(),
        },
    },
    shape: {
        borderRadius: 12,
    },
});

theme = responsiveFontSizes(theme);

theme = createTheme(theme, {
    components: {
        MuiPaper: {
            styleOverrides: {
                elevation0: {
                    backgroundColor: theme.palette.surfaceVariant.main,
                    color: theme.palette.surfaceVariant.contrastText,
                },
                elevation1: {
                    backgroundColor: Color.default(
                        hexFromArgb(md_colors.surface),
                    )
                        .mix(
                            Color.default(hexFromArgb(md_colors.primary)),
                            0.05,
                        )
                        .hex(),
                },
                elevation2: {
                    backgroundColor: Color.default(
                        hexFromArgb(md_colors.surface),
                    )
                        .mix(
                            Color.default(hexFromArgb(md_colors.primary)),
                            0.08,
                        )
                        .hex(),
                },
                elevation3: {
                    backgroundColor: Color.default(
                        hexFromArgb(md_colors.surface),
                    )
                        .mix(
                            Color.default(hexFromArgb(md_colors.primary)),
                            0.11,
                        )
                        .hex(),
                },
                elevation4: {
                    backgroundColor: Color.default(
                        hexFromArgb(md_colors.surface),
                    )
                        .mix(
                            Color.default(hexFromArgb(md_colors.primary)),
                            0.12,
                        )
                        .hex(),
                },
                elevation5: {
                    backgroundColor: Color.default(
                        hexFromArgb(md_colors.surface),
                    )
                        .mix(
                            Color.default(hexFromArgb(md_colors.primary)),
                            0.14,
                        )
                        .hex(),
                },
                outlined: {
                    borderColor: hexFromArgb(md_colors.outline),
                },
            },
        },
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
                    backgroundColor: Color.default(
                        hexFromArgb(md_colors.surface),
                    )
                        .mix(
                            Color.default(hexFromArgb(md_colors.primary)),
                            0.05,
                        )
                        .hex(),
                    color: theme.palette.surface.contrastText,
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
