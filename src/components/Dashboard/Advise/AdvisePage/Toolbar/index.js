// react
import React, { useState, useContext } from "react";
import PropTypes from "prop-types";

// material-ui
import {
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Collapse,
  IconButton,
  Badge
} from "@material-ui/core";
import AccountTreeRoundedIcon from "@material-ui/icons/AccountTreeRounded";
import TableRowsIcon from "@material-ui/icons/TableRows";
import DescriptionRoundedIcon from "@material-ui/icons/DescriptionRounded";
import DownloadRoundedIcon from "@material-ui/icons/DownloadRounded";
import FilterAltRoundedIcon from "@material-ui/icons/FilterAltRounded";

// Shared
import SearchBar from "components/Shared/SearchBar";

// redux
import { StateContext } from "App";

// local
import FilterForm from "./FilterForm";
import { MakeTextFile } from "./hooks/MakeTextFile";

const Toolbar = ({
  handleSearch,
  handleDisplay,
  display,
  applyFilter,
  initialFilter
}) => {
  const [filterView, setFilterView] = useState(false);
  const [filterCount, setFilterCount] = useState(0);

  const state = useContext(StateContext);

  // lockfile downloadLink
  const downloadLink = MakeTextFile(
    state?.advise?.report?.products?.[0]?.project?.requirements_locked
  );

  return (
    <Grid
      container
      spacing={1}
      alignItems="stretch"
      justifyContent="space-between"
    >
      <Grid item xs>
        <ToggleButtonGroup value={display} exclusive onChange={handleDisplay}>
          <ToggleButton value="graph">
            <AccountTreeRoundedIcon />
          </ToggleButton>
          <ToggleButton value="table">
            <TableRowsIcon />
          </ToggleButton>
          <ToggleButton value="file">
            <DescriptionRoundedIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      {display !== "file" ? (
        <Grid item xs={7}>
          <SearchBar
            helpertext="Filter packages"
            onChange={handleSearch}
            righticon={
              <Badge badgeContent={filterCount} color="primary">
                <IconButton
                  aria-label="filter"
                  onClick={() => setFilterView(!filterView)}
                >
                  <FilterAltRoundedIcon />
                </IconButton>
              </Badge>
            }
          />
        </Grid>
      ) : (
        <Grid item xs={3}>
          <Button
            sx={{ height: "100%" }}
            variant="outlined"
            endIcon={<DownloadRoundedIcon />}
            href={downloadLink}
            download="Pipfile.lock"
          >
            Download
          </Button>
        </Grid>
      )}
      <Grid item xs={12}>
        <Collapse in={filterView}>
          <FilterForm
            initialFilter={initialFilter}
            applyFilter={filter => {
              let count = 0;
              Object.entries(filter).forEach(([key, value]) => {
                if (value.query !== initialFilter[key].query) {
                  count++;
                }
              });
              setFilterCount(count);
              setFilterView(false);
              applyFilter(filter);
            }}
          />
        </Collapse>
      </Grid>
    </Grid>
  );
};

Toolbar.propTypes = {
  handleSearch: PropTypes.func.isRequired,
  handleDisplay: PropTypes.func.isRequired,
  display: PropTypes.string.isRequired,
  applyFilter: PropTypes.func.isRequired
};

export default Toolbar;
