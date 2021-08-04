// React
import React, { useContext, useState, useEffect } from "react";

// local components
import NetworkGraph from "./NetworkGraph.js";
import TabPanel from "components/Shared/TabPanel";
import AdviseTable from "./AdviseTable";
import Toolbar from "./Toolbar";
import Lockfile from "./Lockfile";
import AccordianList from "./AccordianList";

// Shared
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

//utils
import { Graph } from "utils/Graph";

// material-ui
import { Paper, Grid, Box, Tab, Tabs } from "@material-ui/core";

import { makeStyles } from "@material-ui/styles";

// redux
import { StateContext } from "App";

const useStyles = makeStyles(theme => ({
  graph: {
    padding: theme.spacing(2)
  }
}));

const PackageDependencies = () => {
  const classes = useStyles();
  const state = useContext(StateContext);

  const root = state.focus ?? "*App";

  const initialFilter = {
    lockfile: { query: "new", operator: "=" },
    change: { query: "", operator: "=" },
    id: { operator: "=", query: "" },
    version: { operator: "=", query: "" },
    license: { operator: "=", query: "" },
    depth: { operator: "=", query: "" },
    depenencies: { operator: "=", query: "" },
    between: { query: true }
  };

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(initialFilter);
  const [filteredGraph, setFilteredGraph] = useState();

  // for display control
  const [tab, setTab] = useState(0);
  const [display, setDisplay] = useState("graph");

  const handleJustificationSelect = (event, isExpanded, package_name, i) => {
    if (isExpanded) {
      setFilter({
        ...filter,
        id: { query: package_name, operator: "=" },
        between: { query: true }
      });
      setSearch(package_name);
      const section = document.getElementById(package_name);
      if (section) {
        section.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    } else {
      setFilter(initialFilter);
      setSearch("");
    }
  };

  const handleDisplay = (event, newDisplay) => {
    if (newDisplay) {
      setDisplay(newDisplay);
    }
  };

  const handleSearch = event => {
    setSearch(event.target.value);
  };

  const applyFilter = filter => {
    setFilter(filter);
  };

  useEffect(() => {
    if (!filter || !state.mergedGraph.nodes) {
      return;
    }

    const filteredNodes = new Map();
    state.mergedGraph.nodes.forEach((value, key) => {
      let passing = true;
      Object.entries(filter).forEach(([paramName, paramDetails]) => {
        if (paramDetails.query !== "") {
          if (paramName === "lockfile") {
            passing =
              (paramDetails.query === "both" ||
                value.value[paramName].includes(paramDetails.query)) &&
              passing;
            return;
          } else if (key === root) {
            return;
          }

          const compare = isNaN(Number(value.value[paramName]))
            ? value.value[paramName]
            : Number(value.value[paramName]);

          const query = isNaN(Number(paramDetails.query))
            ? paramDetails.query
            : Number(paramDetails.query);

          switch (paramDetails.operator) {
            case "=":
              passing = query === compare && passing;
              break;
            case "!=":
              passing = query !== compare && passing;
              break;
            case ">":
              passing = compare > query && passing;
              break;
            case ">=":
              passing = compare >= query && passing;
              break;
            case "<":
              passing = compare < query && passing;
              break;
            case "<=":
              passing = compare <= query && passing;
              break;
            case "~":
              passing =
                value.value[paramName].includes(paramDetails.query) && passing;
              break;
            case "!~":
              passing =
                !value.value[paramName].includes(paramDetails.query) && passing;
              break;
            default:
              if (query) {
                passing = query && passing;
              }
          }
        }
      });
      if (passing) {
        filteredNodes.set(key, state.mergedGraph.nodes.get(key));
      }
    });

    const graph = new Graph();
    graph.nodes = filteredNodes;
    graph.visEdges = state.mergedGraph.visEdges;

    setFilteredGraph(graph);
  }, [filter, state.mergedGraph, root]);

  return (
    <LoadingErrorTemplate isLoading={state.mergedGraph === undefined}>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="flex-start"
        mt={2}
      >
        <Grid item s={12} md={6}>
          <Paper className={classes.graph}>
            <Toolbar
              handleSearch={handleSearch}
              handleDisplay={handleDisplay}
              display={display}
              initialFilter={initialFilter}
              applyFilter={applyFilter}
            />
            <TabPanel value={display} index={"graph"}>
              <NetworkGraph
                className={classes.graph}
                root={root}
                search={search}
                filteredGraph={filteredGraph}
                renderPathNodes={filter?.between?.query}
              />
            </TabPanel>
            <TabPanel value={display} index={"table"}>
              <AdviseTable search={search} filteredGraph={filteredGraph} />
            </TabPanel>
            <TabPanel value={display} index={"file"}>
              <Lockfile
                file={
                  state?.advise?.report?.products?.[0]?.project
                    ?.requirements_locked
                }
              />
            </TabPanel>
          </Paper>
        </Grid>
        <Grid item s={12} md={6}>
          <Tabs
            value={tab}
            onChange={(event, newValue) => setTab(newValue)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Advise" />
            <Tab label="Licenses" />
          </Tabs>
          <Box mt={4}>
            <TabPanel value={tab} index={0}>
              <AccordianList
                justifications={
                  state?.advise?.report?.products?.[0]?.justification
                }
                handleJustificationSelect={handleJustificationSelect}
              />
            </TabPanel>
          </Box>
          <TabPanel value={tab} index={1}>
            under construnction
          </TabPanel>
        </Grid>
      </Grid>
    </LoadingErrorTemplate>
  );
};

export default PackageDependencies;
