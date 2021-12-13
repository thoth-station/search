import React, { useState } from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import SearchBar from "components/Elements/SearchBar";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { AdviseTableView } from "../components";
import { SelectedPackage } from "../features";
import PropTypes from "prop-types";
import { Graph } from "utils/Graph";

export const SelectedPackageContext = React.createContext();

export const AdviseDetails = ({ mergedGraph }) => {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState();

    const handleSearch = event => {
        setSearch(event.target.value);
    };

    if (!mergedGraph) {
        return null;
    }

    return (
        <SelectedPackageContext.Provider value={{ selected, setSelected }}>
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
                            filteredGraph={mergedGraph}
                        />
                    </Paper>
                </Grid>
                <Grid item s={12} md={6}>
                    {!selected ? (
                        <Typography variant="body1" align="center">
                            No package selected
                        </Typography>
                    ) : (
                        <SelectedPackage mergedGraph={mergedGraph} />
                    )}
                </Grid>
            </Grid>
        </SelectedPackageContext.Provider>
    );
};

AdviseDetails.propTypes = {
    mergedGraph: PropTypes.objectOf(Graph),
};
