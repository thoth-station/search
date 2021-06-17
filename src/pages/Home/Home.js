// react
import React from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

// material-ui
import { Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// local
import { DASHBOARD, ROOT } from "navigation/CONSTANTS";
import SearchBar from "components/Shared/SearchBar";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "center",
    marginTop: "20%"
  },
  search: {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    minWidth: "50%"
  },
  description: {
    marginBottom: theme.spacing(6)
  },
  title: {
    marginBottom: theme.spacing(1)
  },
  button: {
    marginLeft: theme.spacing(2)
  }
}));

const Home = () => {
  const history = useHistory();
  const classes = useStyles();

  const goTo = path => {
    history.push(path || ROOT);
  };

  const handleChange = e => {};

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        <b>Thoth Search</b>
      </Typography>
      <Typography variant="b1" className={classes.description}>
        Use this search box to lookup specific Python packages.
      </Typography>
      <div className={classes.search}>
        <SearchBar
          label="Search for a Python package"
          onChange={e => handleChange(e)}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={() => goTo(DASHBOARD)}
          className={classes.button}
        >
          <b>Search</b>
        </Button>
      </div>
    </div>
  );
};

Home.propTypes = {
  title: PropTypes.string.isRequired
};

export default Home;
