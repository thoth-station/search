import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}));

const SearchResults = () => {
  const classes = useStyles();

  useEffect(() => {}, []);

  return (
    <div className={classes.root}>
      <List component="nav">
        <ListItem button component="a">
          <ListItemText primary="Result" />
        </ListItem>
      </List>
    </div>
  );
};

export default SearchResults;
