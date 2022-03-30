import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

interface IProps {
    children: React.ReactNode;
    goHome?: boolean;
}

/**
 * Layout is used in most of the app and allows for backwards navigation.
 */
export const NavigationLayout = ({ children, goHome = false }: IProps) => {
    const navigate = useNavigate();

    return (
        <>
            <Button
                onClick={() => {
                    if (goHome) {
                        navigate("/");
                    } else {
                        navigate(-1);
                    }
                }}
            >
                {goHome ? "go home" : "go back"}
            </Button>
            <div>{children}</div>
        </>
    );
};
