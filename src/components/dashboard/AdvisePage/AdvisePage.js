// React
import React, { useContext, useState } from "react";

// local components
import AdviseTableView from "./AdviseTableView";
import SearchBar from "components/shared/SearchBar";
import SelectedPackage from "./SelectedPackage";

// Shared
import LoadingErrorTemplate from "components/shared/LoadingErrorTemplate";

// material-ui
import { Paper, Grid, Typography } from "@material-ui/core";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

// redux
import { StateContext } from "App";

const AdvisePage = () => {
  const state = useContext(StateContext);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState();

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
            <SearchBar
              onChange={handleSearch}
              lefticon={<SearchRoundedIcon />}
            />
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
            <SelectedPackage selectedKey={selected} setSelected={setSelected} />
          )}
        </Grid>
      </Grid>
    </LoadingErrorTemplate>
  );
};

export default AdvisePage;
