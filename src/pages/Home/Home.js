// react
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

// material-ui
import { Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// local
import { DASHBOARD } from "navigation/CONSTANTS";
import SearchBar from "components/Shared/SearchBar";

// api
import { searchForPackage } from "services/thothApi";

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

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const handleChange = e => {
    setSearch(e);
    if (error !== "") {
      setError("");
    }
  };

  const handleSearch = () => {
    if (search !== "") {
      searchForPackage(search)
        .then(result => {
          //history.push(DASHBOARD + "?q=" + search, result.data);
          history.push(DASHBOARD + "/" + search, result.data);
        })
        .catch(() => {
          setError("No results");
        });
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        <b>Thoth Search</b>
      </Typography>
      <Typography variant="body1" className={classes.description}>
        Use this search box to lookup specific Python packages.
      </Typography>
      <div className={classes.search}>
        <SearchBar
          label="Search for a Python package"
          onChange={e => handleChange(e)}
          helperText={error}
          error={error !== ""}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSearch()}
          className={classes.button}
        >
          <b>Search</b>
        </Button>
      </div>
    </div>
  );
};

export default Home;
