// React
import React, { useContext, useState } from "react";

// local components
import NetworkGraph from "components/Dashboard/Advise/NetworkGraph.js";
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";
import TabPanel from "components/Shared/TabPanel";

// utils
import { useFormatVisGraph } from "utils/produceMetrics";

// material-ui
import {
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Box,
  Tab,
  Tabs
} from "@material-ui/core";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import AccountTreeRoundedIcon from "@material-ui/icons/AccountTreeRounded";
import TableRowsIcon from "@material-ui/icons/TableRows";
import DescriptionRoundedIcon from "@material-ui/icons/DescriptionRounded";
import { makeStyles } from "@material-ui/styles";

// redux
import { StateContext } from "App";

const useStyles = makeStyles(theme => ({
  graph: {
    padding: theme.spacing(2)
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2)
  }
}));

const PackageDependencies = () => {
  const classes = useStyles();
  const state = useContext(StateContext);
  const root = state.focus ?? "*App";
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [expanded, setExpanded] = useState(false);
  // for tab control
  const [tab, setTab] = useState(0);
  const [display, setDisplay] = React.useState("graph");

  const { visGraph } = useFormatVisGraph(
    state.initGraph,
    state.adviseGraph,
    root
  );

  const handleJustificationSelect = (package_name, i) => (
    event,
    isExpanded
  ) => {
    setExpanded(isExpanded ? i : false);

    if (isExpanded) {
      setSelectedPackage(package_name);
    } else {
      setSelectedPackage(null);
    }
  };

  const handleDisplay = (event, newDisplay) => {
    if (newDisplay) {
      setDisplay(newDisplay);
    }
  };

  return (
    <LoadingErrorTemplate isLoading={visGraph === undefined}>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid item s={12} md={6}>
          <Paper>
            <ToggleButtonGroup
              value={display}
              exclusive
              onChange={handleDisplay}
              aria-label="text alignment"
              className={classes.buttonGroup}
            >
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

            <TabPanel value={display} index={"graph"}>
              <NetworkGraph
                data={visGraph}
                className={classes.graph}
                root={root}
                selectedPackage={selectedPackage}
              />
            </TabPanel>
            <TabPanel value={display} index={"table"}></TabPanel>
            <TabPanel value={display} index={"file"}>
              <Typography>
                {JSON.stringify(
                  state?.advise?.report?.products?.[0]?.project
                    ?.requirements_locked
                )}
              </Typography>
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
              {state?.advise?.report?.products?.[0]?.justification.map(
                (justification, i) => {
                  if (justification.type !== "INFO") {
                    return (
                      <Accordion
                        key={i}
                        onChange={handleJustificationSelect(
                          justification.package_name,
                          i
                        )}
                        expanded={expanded === i}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreRoundedIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>{justification.message}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>{justification.advisory}</Typography>
                          <Button href={justification.link}>READ MORE</Button>
                        </AccordionDetails>
                      </Accordion>
                    );
                  } else return null;
                }
              )}
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
