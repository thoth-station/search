// React
import React, { useContext, useState, useMemo } from "react";

// local components
import AdviseTableView from "./AdviseTableView";

import SelectedPackage from "./SelectedPackage";

// utils
import { discoverPackageChanges } from "./utils";

// Shared
import LoadingErrorTemplate from "components/shared/LoadingErrorTemplate";

// material-ui
import { Paper, Grid, Typography } from "@material-ui/core";

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
  const [selected, setSelected] = useState();

  const justifications = useMemo(() => {
    return discoverPackageChanges(
      state?.mergedGraph?.nodes,
      state?.advise?.report?.products?.[0]?.justification
    );
  }, [state?.mergedGraph?.nodes, state?.advise?.report?.products]);

  const handleSearch = event => {
    setSearch(event.target.value);
  };

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
            <AdviseTableView
              search={search}
              filteredGraph={state.mergedGraph}
              selected={selected}
              setSelected={setSelected}
            />
          </Paper>
        </Grid>
        <Grid item s={12} md={6}>
          {!selected ? (
            <Typography variant="body1" align="center">
              No package selected
            </Typography>
          ) : (
            <SelectedPackage selectedKey={selected} />
          )}
        </Grid>
      </Grid>
    </LoadingErrorTemplate>
  );
};

export default AdvisePage;
