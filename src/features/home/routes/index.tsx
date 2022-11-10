// react
import React, { useState } from "react";

// material-ui
import { Typography, Grid, Divider, ToggleButtonGroup, ToggleButton, Box } from "@mui/material";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// local
import TabPanel from "components/atoms/TabPanel";
import logo from "assets/thoth-logo.png";

import { PackageSearch, AdviseCreation, ImageSearch } from "../components";
import Footer from "components/organisms/Footer";

export const Home = () => {
  // utility states
  const [mode, setMode] = useState<string>("package");

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  // change mode view
  const handleMode = (event: any, newMode: string) => {
    if (newMode) {
      setMode(newMode);
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ paddingX: 2, maxWidth: "1000px", margin: "auto" }}>
      <Grid item>
        <Box sx={{ marginTop: 10 }}>
          <img alt="Thoth Logo" src={logo} height={!matches ? "auto" : 300} width={"100%"} />
        </Box>
      </Grid>
      <Grid container item justifyContent="center" mt={5} spacing={0}>
        <Grid item xs={12} alignItems="left" mb={3}>
          <Typography variant="h4">
            <b>Thoth Search</b>
          </Typography>
        </Grid>
        <Grid item xs={12} alignItems="left">
          <Typography variant="subtitle1">
            Thoth Search is a tool that runs analysis on a Python application. It utilizes package metadata and Thoth
            Adviser to analyze and recommend a software stack. You can run analysis on an entire Python application
            using a properly formatted Pipfile and Pipfile.lock. Alternatively, you can analyze a single Python package
            to see what Thoth knows about the package.
          </Typography>
        </Grid>
        <Grid item textAlign="center" xs={12} mt={3} mb={4}>
          <ToggleButtonGroup value={mode} exclusive onChange={handleMode} size={!matches ? "small" : "large"}>
            <ToggleButton value="package">
              <b>package</b>
            </ToggleButton>
            <ToggleButton value="environment">
              <b>environment</b>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <Grid item xs={12} sx={{ marginBottom: 3 }}>
          <Divider />
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
      <Grid item xs={12}>
        <Footer />
      </Grid>
    </Grid>
  );
};
