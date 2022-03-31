import * as React from "react";
import { Footer } from "../Footer";
import { Stack } from "@mui/material";

interface IProps {
    children: React.ReactNode;
}

/**
 * Main layout adds margins and spacing to the whole app.
 */
export const MainLayout = ({ children }: IProps) => {
    return (
        <Stack direction="column" justifyContent="flex-start">
            <div
                style={{ minHeight: "100vh", padding: "1.5rem 4rem 9rem 4rem" }}
            >
                {children}
            </div>
            <Footer />
        </Stack>
    );
};
