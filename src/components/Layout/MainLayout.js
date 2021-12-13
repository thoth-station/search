import * as React from "react";
import { makeStyles } from "@material-ui/styles";
import { Footer } from "../Footer";
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({
    root: {
        marginLeft: "auto",
        marginRight: "auto",
        paddingRight: theme.spacing(3),
        paddingLeft: theme.spacing(3),
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(15),
        minHeight: "100vh",
    },
}));

/**
 * Main layout adds margins and spacing to the whole app.
 */
export const MainLayout = ({ children }) => {
    const classes = useStyles();

    return (
        <>
            <div className={classes.root}>{children}</div>
            <Footer />
        </>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node,
};
