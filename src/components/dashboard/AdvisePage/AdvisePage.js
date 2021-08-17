// React
import React, { useContext, useState } from "react";

// local components
import NetworkGraphView from "./NetworkGraphView";
import TabPanel from "components/shared/TabPanel";
import AdviseTableView from "./AdviseTableView";
import Toolbar from "./Toolbar";
import LockfileView from "./LockfileView";
import AccordianList from "./AccordianList";

// hooks
import { useFilterGraph } from "./hooks";

// utils
import { formatJustifications } from "./utils";

// Shared
import LoadingErrorTemplate from "components/shared/LoadingErrorTemplate";

// material-ui
import {
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography
} from "@material-ui/core";

// redux
import { StateContext } from "App";

const initialFilter = {
  lockfile: { query: "new", operator: "=" },
  change: { query: "", operator: "=" },
  id: { operator: "=", query: "" },
  version: { operator: "=", query: "" },
  license: { operator: "=", query: "" },
  depth: { operator: "=", query: "" },
  dependencies: { operator: "=", query: "" },
  between: { query: true }
};

const AdvisePage = () => {
  const state = useContext(StateContext);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(initialFilter);

  const filteredGraph = useFilterGraph(filter, "*App", state?.mergedGraph);

  // for display control
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

  console.log(state);

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
          <Paper sx={{ padding: 2 }}>
            <Toolbar
              handleSearch={handleSearch}
              handleDisplay={handleDisplay}
              display={display}
              initialFilter={initialFilter}
              applyFilter={applyFilter}
            />
            <TabPanel value={display} index={"graph"}>
              <NetworkGraphView
                root={"*App"}
                search={search}
                filteredGraph={filteredGraph}
                renderPathNodes={filter?.between?.query}
                lockfile={filter?.lockfile?.query}
              />
            </TabPanel>
            <TabPanel value={display} index={"table"}>
              <AdviseTableView search={search} filteredGraph={filteredGraph} />
            </TabPanel>
            <TabPanel value={display} index={"file"}>
              <LockfileView
                file={
                  state?.advise?.report?.products?.[0]?.project
                    ?.requirements_locked
                }
              />
            </TabPanel>
          </Paper>
        </Grid>
        <Grid item s={12} md={6}>
          <Card>
            <CardHeader
              title={<Typography variant="h4">Removed Packages</Typography>}
              subheader={
                <Typography variant="body1">
                  Packages Thoth decided to remove from the original
                  Pipfile.lock
                </Typography>
              }
            />
            <CardContent>
              <AccordianList
                justifications={formatJustifications(
                  state?.advise?.report?.products?.[0]?.justification
                )}
                handleJustificationSelect={handleJustificationSelect}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              title={<Typography variant="h4">Removed Packages</Typography>}
              subheader={
                <Typography variant="body1">
                  Packages Thoth decided to remove from the original
                  Pipfile.lock
                </Typography>
              }
            />
            <CardContent>
              <AccordianList
                justifications={formatJustifications(
                  state?.advise?.report?.products?.[0]?.justification
                )}
                handleJustificationSelect={handleJustificationSelect}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </LoadingErrorTemplate>
  );
};

export default AdvisePage;
