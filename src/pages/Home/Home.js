// react
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

// material-ui
import { Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// local
import { DASHBOARD } from "navigation/CONSTANTS";
import SearchBar from "components/Shared/SearchBar";

// redux
import { DispatchContext } from "App";

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
    marginBottom: theme.spacing(6),
    maxWidth: "50%",
    textAlign: "center"
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
  const dispatch = useContext(DispatchContext);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const handleChange = e => {
    setSearch(e);
    if (error !== "") {
      setError("");
    }
  };

  const handleSearch = async () => {
    if (search !== "") {
      // if github
      if (search.includes("github.com")) {
        console.log("run thoth analyis");
      } else {
        // split the search query
        const splitSearch = search.split(",");
        let failSearch = true;

        // check if all packages searched for a valid packages
        for (var i = 0; i < splitSearch.length; i++) {
          const valid = await searchForPackage(splitSearch[i]).catch(() => {
            // if invalid set error and return false
            setError("No results");
            return false;
          });

          // if the package was invalid then fail the whole search query
          if (valid === false) {
            failSearch = false;
            return;
          }
        }

        // only naviagte to dashbaord if the search query is valid
        if (failSearch) {
          dispatch({
            type: "reset"
          });
          if (splitSearch.length === 1) {
            history.push(DASHBOARD + "/" + splitSearch[0]);
          }
          // if there are multiple packages then use query params
          else {
            history.push(DASHBOARD + "?packages=" + splitSearch);
          }
        }
      }
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        <b>Thoth Search</b>
      </Typography>
      <Typography variant="body1" className={classes.description}>
        Use this search box to run analysis on a specific Python package or
        provide a GitHub link to run analyis on a Python ecosystem. A valid
        ecosystem will have a properly formatted Pipfile and Pipfile.lock.
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
