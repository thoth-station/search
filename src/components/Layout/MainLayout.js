import * as React from "react";
import { Footer } from "../Footer";
import PropTypes from "prop-types";



/**
 * Main layout adds margins and spacing to the whole app.
 */
export const MainLayout = ({ children }) => {
    return (
        <>
            <div>{children}</div>
            <Footer />
        </>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node,
};
