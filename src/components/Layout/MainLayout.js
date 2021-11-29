import * as React from 'react';
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        maxWidth: "95%",
        marginLeft: "auto",
        marginRight: "auto",
        paddingRight: theme.spacing(3),
        paddingLeft: theme.spacing(3),
        marginTop: theme.spacing(4)
    }
}));

export const MainLayout = ({ children }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div>{children}</div>
        </div>
    );
};