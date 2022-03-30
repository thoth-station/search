import * as React from "react";
import { Tab, Tabs } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useMemo } from "react";

interface IProps {
    children: React.ReactNode;
    header: React.ReactNode;
}

/**
 * A layout used for the advise feature tabs. It formats the tabs as router links.
 */
export const AdviseLayout = ({ children, header }: IProps) => {
    const location = useLocation();

    const currentTab = useMemo(() => {
        const ending = location.pathname.split("/").at(-1);
        if (ending === "summary" || ending === "details") {
            return ending;
        } else {
            return "summary";
        }
    }, [location.pathname]);

    return (
        <>
            <div>
                {header}
                <Tabs
                    value={currentTab}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab
                        label="Summary"
                        value={"summary"}
                        component={RouterLink}
                        to="summary"
                    />
                    <Tab
                        label="Advise Results"
                        value={"details"}
                        component={RouterLink}
                        to="details"
                    />
                </Tabs>
            </div>
            <div>{children}</div>
        </>
    );
};
