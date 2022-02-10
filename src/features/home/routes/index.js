// react
import React, { useState } from "react";

// material-ui
import {
    Typography,
    Grid,
    Divider,
    ToggleButtonGroup,
    ToggleButton,
    Box,
} from "@material-ui/core";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// local
import TabPanel from "components/Elements/TabPanel";
import logo from "assets/thoth-logo.png";

import { PackageSearch, AdviseCreation, ImageSearch } from "../components";

export const Home = () => {
    // utility states
    const [mode, setMode] = useState("package");

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up("sm"));

    // change mode view
    const handleMode = (event, newMode) => {
        if (newMode) {
            setMode(newMode);
        }
    };

    return (
        <div
            style={{
                maxWidth: "1000px",
                marginLeft: "auto",
                marginRight: "auto",
            }}
        >
            <Grid container justifyContent="center">
                <Grid item>
                    <Box sx={{ marginTop: 10 }}>
                        <img
                            alt="Thoth Logo"
                            src={logo}
                            height={!matches ? "auto" : 300}
                            width={"100%"}
                        />
                    </Box>
                </Grid>
                <Grid container item justifyContent="center" mt={5} spacing={0}>
                    <Grid container item sm={12} md={6} align="center" mr={5}>
                        <Grid item xs={12} align="left" mb={3}>
                            <Typography variant="h4">
                                <b>Thoth Search</b>
                            </Typography>
                        </Grid>
                        <Grid item xs={12} align="left">
                            <Typography variant="subtitle1">
                                Thoth Search is a tool that runs analysis on a
                                Python application. It utilizes package metadata
                                and Thoth Adviser to analyse and recommend a
                                software stack. You can run analysis on an
                                entire Python application using a properly
                                formatted Pipfile and Pipfile.lock.
                                Alternatively, you can analyse a single Python
                                package to see what Thoth knows about the
                                package.
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        container
                        sm={12}
                        md={5}
                        direction="column"
                        justifyContent="center"
                        spacing={1}
                    >
                        {[
                            ["One", "100k"],
                            ["Two", "20%"],
                            ["Three", "62"],
                            ["Four", "N/A"],
                        ].map((stat, i) => {
                            return (
                                <Grid
                                    item
                                    container
                                    alignItems="center"
                                    key={i}
                                >
                                    <Grid item xs={6}>
                                        <Typography variant="h6">
                                            <b>Thoth Statistic {stat[0]}</b>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
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
                            size={!matches ? "small" : "large"}
                        >
                            <ToggleButton value="package">
                                <b>package</b>
                            </ToggleButton>
                            <ToggleButton value="environment">
                                <b>environment</b>
                            </ToggleButton>
                            <ToggleButton value="image">
                                <b>image</b>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ marginBottom: 3 }} />
                        <TabPanel value={mode} index="package">
                            <PackageSearch />
                        </TabPanel>
                        <TabPanel value={mode} index="environment">
                            <AdviseCreation />
                        </TabPanel>
                        <TabPanel value={mode} index="image">
                            <ImageSearch />
                        </TabPanel>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};
