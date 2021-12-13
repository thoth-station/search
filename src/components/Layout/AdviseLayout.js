import * as React from "react";
import { Tab, Tabs } from "@material-ui/core";
import { Link as RouterLink, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * A layout used for the advise feature tabs. It formats the tabs as router links.
 */
export const AdviseLayout = ({ children, header }) => {
    const location = useLocation();

    return (
        <>
            <div>
                {header}
                <Tabs
                    value={location.pathname.split("/").at(-1)}
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

AdviseLayout.propTypes = {
    children: PropTypes.node,
    header: PropTypes.element,
};
