// react
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

// material-ui
import { Typography, Box, Grid } from "@material-ui/core";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { makeStyles } from "@material-ui/styles";

// local
import { DASHBOARD } from "navigation/CONSTANTS";
import SearchBar from "components/Shared/SearchBar";

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
  const [pipfileQuery, setPipfileQuery] = useState("");
  const [pipfileLockQuery, setPipfileLockQuery] = useState("");

  // textbox errors
  const [pipfileError, setPipfileError] = useState("");
  const [pipfileLockError, setPipfileLockError] = useState("");

  // utlity states

  const [queryLoading, setQueryLoading] = useState(false);

  // handle textbox state change
  const handleChange = (e, box) => {
    switch (box) {
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

  // handle the input
  const handleAnalyze = async () => {
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
        <br /> Provide a properly formatted Pipfile and Pipfile.lock to run
        analysis on your Python application.
      </Typography>

      <Grid container spacing={2} justifyContent="center" mt={2}>
        <Grid item xs={10} sm={5}>
          <SearchBar
            label={pipfileError !== "" ? pipfileError : "Pipfile contents"}
            onChange={e => handleChange(e, "pipfile")}
            error={pipfileError !== ""}
            multiline
            rows={8}
          />
        </Grid>
        <Grid item xs={10} sm={5}>
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
    </div>
  );
};

export default Home;
