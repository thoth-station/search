// react
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

// material-ui
import { Typography, Button, Box, Grid } from "@material-ui/core";
import LoadingButton from "@material-ui/lab/LoadingButton";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

// local
import { ADVISE, PACKAGE } from "navigation/CONSTANTS";
import SearchBar from "components/shared/SearchBar";
import TabPanel from "components/shared/TabPanel";
import logo from "assets/thoth-logo.png";

// redux
import { DispatchContext } from "App";

// api
import { thothAdvise, searchForPackage } from "services/thothApi";

const Home = () => {
  const history = useHistory();
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
    if (mode === "single") {
      // if no query
      if (searchQuery === "") {
        return;
      }

      searchForPackage(searchQuery)
        .then(response => {
          history.push(PACKAGE + "/" + response.data.info.name);
        })
        .catch(e => {
          setSearchError("Package does not exist");
        });
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
            history.push(ADVISE + "/" + response.data.analysis_id);
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
    <Grid container justifyContent="center">
      <Grid item>
        <Button sx={{ marginTop: 10 }}>
          <img alt="Thoth Logo" src={logo} height={300} width={"100%"} />
        </Button>
      </Grid>
      <Grid container item justifyContent="center" mt={5} spacing={0}>
        <Grid container item xs={3} align="center" mr={5}>
          <Grid item xs={12} align="left" mb={3}>
            <Typography variant="h4">
              <b>Thoth Search</b>
            </Typography>
          </Grid>
          <Grid item xs={12} align="left">
            <Typography variant="subtitle1">
              Thoth Search is a tool that runs analysis on a Python application.
              It utilizes package metadata and Thoth Adviser to analyse and
              recommend a software stack. You can run analysis on a on an entire
              Python application using a properly formatted Pipfile and
              Pipfile.lock. Alternatively, you can analyse a single Python
              package to see what Thoth knows about the package.
            </Typography>
          </Grid>
        </Grid>

        <Grid
          item
          container
          xs={2}
          direction="column"
          justifyContent="center"
          spacing={1}
        >
          {[
            ["One", "100k"],
            ["Two", "20%"],
            ["Three", "62"],
            ["Four", "N/A"]
          ].map(stat => {
            return (
              <Grid item container alignItems="center">
                <Grid item xs={6}>
                  <Typography variant="h6">
                    <b>Thoth Statistic {stat[0]}</b>
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h5" align="right">
                    {stat[1]}
                  </Typography>
                </Grid>
              </Grid>
            );
          })}
        </Grid>

        <Grid item xs={12} align="center" mt={3} mb={4}>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleMode}
            size={"large"}
          >
            <ToggleButton value="single">
              <b>single package analysis</b>
            </ToggleButton>
            <ToggleButton value="multiple">
              <b>Python application analysis</b>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <Grid item xs={5}>
          <TabPanel value={mode} index={"single"}>
            <Grid container>
              <Grid item xs={10}>
                <Typography
                  color="error"
                  variant="body1"
                  sx={{ minHeight: 30 }}
                >
                  {searchError ?? ""}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <SearchBar
                  error={searchError !== ""}
                  onChange={e => handleChange(e, "single")}
                  helpertext={"Search for a Python package"}
                  type="search"
                  boxprops={{ mr: 2 }}
                  lefticon={<SearchRoundedIcon />}
                />
              </Grid>
              <Grid item sm={10} lg={1} ml={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAnalyze()}
                  sx={{ minHeight: "100%", minWidth: "100%" }}
                >
                  <b>Analyze</b>
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={mode} index={"multiple"}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <SearchBar
                  label={
                    pipfileError !== "" ? pipfileError : "Pipfile contents"
                  }
                  onChange={e => handleChange(e, "pipfile")}
                  error={pipfileError !== ""}
                  multiline
                  rows={8}
                />
              </Grid>
              <Grid item xs={6}>
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
                sx={{ minHeight: "100%", minWidth: "100%" }}
              >
                <b>Analyze</b>
              </LoadingButton>
            </Box>
          </TabPanel>
        </Grid>
        <div bgcolor="#444f60" minHeight="300px" mt={5}></div>
      </Grid>
    </Grid>
  );
};

export default Home;
