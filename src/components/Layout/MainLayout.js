import * as React from 'react';
import {makeStyles} from "@material-ui/styles";
import {Footer} from "../Footer";

const useStyles = makeStyles(theme => ({
    root: {
        maxWidth: "95%",
        marginLeft: "auto",
        marginRight: "auto",
        paddingRight: theme.spacing(3),
        paddingLeft: theme.spacing(3),
        marginTop: theme.spacing(4),
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
            <div className={classes.root}>
                {children}
            </div>
            <Footer />
        </>

    );
};