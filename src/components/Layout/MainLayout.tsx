import * as React from "react";
import { Stack } from "@mui/material";

interface IProps {
    children: NonNullable<React.ReactNode>;
}

/**
 * Main layout adds margins and spacing to the whole app.
 */
export const MainLayout = ({ children }: IProps) => {
    return (
        <Stack
            direction="column"
            justifyContent="flex-start"
            sx={{ marginX: "16px" }}
        >
            {children}
        </Stack>
    );
};
