import * as React from "react";
import { Box } from "@mui/material";

interface IProps {
    children: NonNullable<React.ReactNode>;
}

/**
 * Main layout adds margins and spacing to the whole app.
 */
export const MainLayout = ({ children }: IProps) => {
    return (
        <Box sx={{marginY: 2, marginRight: 2, height: "calc(100vh - 32px)"}}>{children}</Box>
    );
};
