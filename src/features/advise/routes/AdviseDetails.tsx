import React, { useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import SearchBar from "components/Elements/SearchBar";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { AdviseTableView, SelectedPackage } from "../components";
import { Graph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";
import { PackageNodeValue } from "lib/interfaces/PackageNodeValue";

type SelectedPackageType = {
    selected: string;
    setSelected: (c: string) => void;
};

export const SelectedPackageContext = React.createContext<SelectedPackageType>(
    {} as SelectedPackageType,
);

interface IAdviseDetails {
    graph?: Graph<Node<PackageNodeValue>>;
}

export const AdviseDetails = ({ graph }: IAdviseDetails) => {
    const [search, setSearch] = useState<string>("");
    const [selected, setSelected] = useState<string>("");

    const handleSearch = (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
        setSearch(event.target.value);
    };

    if (!graph) {
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
                <Grid item sm={12} md={6}>
                    <Paper sx={{ padding: 2 }}>
                        <SearchBar
                            onChange={handleSearch}
                            lefticon={<SearchRoundedIcon />}
                        />
                        <AdviseTableView search={search} graph={graph} />
                    </Paper>
                </Grid>
                <Grid item sm={12} md={6}>
                    {!selected ? (
                        <Typography variant="body1" align="center">
                            No package selected
                        </Typography>
                    ) : (
                        <SelectedPackage graph={graph} />
                    )}
                </Grid>
            </Grid>
        </SelectedPackageContext.Provider>
    );
};
