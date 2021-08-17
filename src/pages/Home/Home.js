// react
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

// material-ui
import { Typography, Button, Box, Collapse, Grid } from "@material-ui/core";
import LoadingButton from "@material-ui/lab/LoadingButton";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { makeStyles } from "@material-ui/styles";

// local
import { DASHBOARD } from "navigation/CONSTANTS";
import SearchBar from "components/shared/SearchBar";
import TabPanel from "components/shared/TabPanel";

// redux
import { DispatchContext } from "App";

// api
import { thothAdvise } from "services/thothApi";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "center",
    marginTop: "10%"
  },
  stretchContent: {
    minWidth: "50%"
  },
  searchBar: {
    display: "flex",
    justifyContent: "center"
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column"
  },
  multilineTextBoxContainer: {
    display: "flex",
    justifyContent: "space-between"
  },
  description: {
    marginBottom: theme.spacing(1),
    maxWidth: "50%",
    textAlign: "center"
  },
  mode: {
    marginBottom: theme.spacing(3)
  },
  title: {
    marginBottom: theme.spacing(1)
  }
}));

const Home = () => {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useContext(DispatchContext);

  // textbox states
  const [searchQuery, setSearchQuery] = useState("");
  const [pipfileQuery, setPipfileQuery] = useState("");
  const [pipfileLockQuery, setPipfileLockQuery] = useState("");

  // textbox errors
  const [searchError, setSearchError] = useState("");
  const [pipfileError, setPipfileError] = useState("");
  const [pipfileLockError, setPipfileLockError] = useState("");

  // utlity states
  const [mode, setMode] = useState("multiple");
  const [expandOptions, setExpandOptions] = useState(false);

  const [queryLoading, setQueryLoading] = useState(false);

  // handle textbox state change
  const handleChange = (e, box) => {
    switch (box) {
      case "single":
        setSearchQuery(e.target.value);
        if (searchError !== "") {
          setSearchError("");
        }
        break;
      case "pipfile":
        setPipfileQuery(e.target.value);
        if (pipfileError !== "") {
          setPipfileError("");
        }
        break;
      case "lock":
        setPipfileLockQuery(e.target.value);
        if (pipfileLockError !== "") {
          setPipfileLockError("");
        }
        break;
      default:
    }
  };

  // change mode view
  const handleMode = (event, newMode) => {
    if (newMode) {
      setMode(newMode);
    }
  };

  // handle the input
  const handleAnalyze = async () => {
    // dispatch({
    // 	type: "reset"
    // });
    // history.push({
    // 	pathname: DASHBOARD,
    // 	state: roots
    // });

    if (mode === "single") {
      // if no query
      if (searchQuery === "") {
        return;
      }
      setSearchError("Package does not exist");
    }
    // if using pipfile and pipfile.lock
    else {
      // if no query
      if (
        pipfileQuery === "" ||
        pipfileLockQuery === "" ||
        pipfileError !== "" ||
        pipfileLockError !== ""
      ) {
        return;
      }

      let fail = false;
      if (!pipfileQuery) {
        fail = true;
        setPipfileError("Please provide a Pipfile");
      }
      if (!pipfileLockQuery) {
        fail = true;
        setPipfileLockError("Please provide a Pipfile.lock");
      }

      // if able to parse both
      if (!fail) {
        setQueryLoading(true);
        thothAdvise(pipfileQuery, pipfileLockQuery)
          .then(response => {
            setQueryLoading(false);
            dispatch({
              type: "advise",
              param: "analysis_id",
              payload: response.data.analysis_id
            });
            history.push(DASHBOARD + "/" + response.data.analysis_id);
          })
          .catch(error => {
            setQueryLoading(false);
            if (error.response.status === 400) {
              if (error.response.data.error.includes("Pipfile.lock")) {
                setPipfileLockError("Failed to parse provided Pipfile.lock");
              } else if (error.response.data.error.includes("Pipfile")) {
                setPipfileError("Failed to parse provided Pipfile");
              }
            }
          });
      }
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.title}>
        <b>Thoth Search</b>
      </Typography>
      <Typography variant="body1" className={classes.description}>
        Thoth Search is a tool that runs analysis on a Python application. It
        utilizes package metadata and Thoth Adviser to analyse and recommend a
        software stack. <br />
        <br /> You can run analysis on a specific Python package or you can
        provide a properly formatted Pipfile and/or Pipfile.lock to run analysis
        on an entire Python application.
      </Typography>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleMode}
        size={"small"}
        className={classes.mode}
      >
        <ToggleButton value="single" aria-label="left aligned" disabled>
          <b>Single Package</b>
        </ToggleButton>
        <ToggleButton value="multiple" aria-label="centered">
          <b>Multiple Packages</b>
        </ToggleButton>
      </ToggleButtonGroup>
      <TabPanel
        value={mode}
        index={"single"}
        className={`${classes.flexColumn} ${classes.stretchContent}`}
      >
        <Box className={classes.searchBar}>
          <SearchBar
            label="Search for a Python package"
            onChange={e => handleChange(e, "single")}
            helpertext={searchError}
            error={searchError !== ""}
            type="search"
            boxprops={{ mr: 2 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={() => handleAnalyze()}
          >
            <b>Analyze</b>
          </Button>
        </Box>

        <Collapse in={expandOptions} timeout="auto" unmountOnExit>
          <Box mt={1}></Box>
        </Collapse>
        <Box textAlign="center" mt={1}>
          <Button
            onClick={() => setExpandOptions(!expandOptions)}
            color="primary"
          >
            {expandOptions ? "Less Options" : "More Options"}
          </Button>
        </Box>
      </TabPanel>

      <TabPanel
        value={mode}
        index={"multiple"}
        className={`${classes.flexColumn} ${classes.stretchContent}`}
      >
        <Grid container spacing={2}>
          <Grid item xs>
            <SearchBar
              label={pipfileError !== "" ? pipfileError : "Pipfile contents"}
              onChange={e => handleChange(e, "pipfile")}
              error={pipfileError !== ""}
              multiline
              rows={8}
            />
          </Grid>
          <Grid item xs>
            <SearchBar
              label={
                pipfileLockError !== ""
                  ? pipfileLockError
                  : "Pipfile.lock contents"
              }
              onChange={e => handleChange(e, "lock")}
              error={pipfileLockError !== ""}
              multiline
              rows={8}
            />
          </Grid>
        </Grid>

        <Box textAlign="center" mt={2}>
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={() => handleAnalyze()}
            loading={queryLoading}
          >
            <b>Analyze</b>
          </LoadingButton>
        </Box>
      </TabPanel>
    </div>
  );
};

export default Home;
