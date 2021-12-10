```js
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
    alert: {
        margin: "5px",
    },
}));

const classes = useStyles();

<CustomAlert
    info={{
        message: "This is an alert!",
        type: "success",
        link: "foo.bar",
    }}
    className={classes.alert}
/>;
```
