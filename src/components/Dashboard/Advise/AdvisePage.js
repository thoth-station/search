// React
import React, { useContext, useState } from "react";

// local components
import NetworkGraph from "components/Dashboard/Advise/NetworkGraph.js";
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";
import TabPanel from "components/Shared/TabPanel";
import AdviseTable from "components/Dashboard/Advise/AdviseTable";
import SearchBar from "components/Shared/SearchBar";

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
  },
  lockfile: {
    overflow: "scroll",
    paddingLeft: theme.spacing(1)
  }
}));

const PackageDependencies = () => {
  const classes = useStyles();
  const state = useContext(StateContext);

  const root = state.focus ?? "*App";
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");

  const [showOldPackages, setShowOldPackages] = useState(false);

  // for tab control
  const [tab, setTab] = useState(0);
  const [display, setDisplay] = React.useState("graph");

  const handleJustificationSelect = (package_name, i) => (
    event,
    isExpanded
  ) => {
    setExpanded(isExpanded ? i : false);

    if (isExpanded) {
      setSelectedPackage(package_name);
      const section = document.getElementById(package_name);
      if (section) {
        section.scrollIntoView({ block: "start", behavior: "smooth" });
      }
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
            <Grid container spacing={1} alignItems="center">
              <Grid item xs>
                <ToggleButtonGroup
                  value={display}
                  exclusive
                  onChange={handleDisplay}
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
              </Grid>
              {display !== "file" ? (
                <>
                  <Grid item xs={6}>
                    <SearchBar
                      label="Filter packages"
                      onChange={event => setSearch(event.target.value)}
                    />
                  </Grid>
                  <Grid item xs>
                    <ToggleButton
                      size={"small"}
                      value="check"
                      selected={showOldPackages}
                      onChange={() => {
                        setShowOldPackages(!showOldPackages);
                      }}
                    >
                      Include Changes
                    </ToggleButton>
                  </Grid>
                </>
              ) : null}
            </Grid>

            <TabPanel value={display} index={"graph"}>
              <NetworkGraph
                className={classes.graph}
                root={root}
                selectedPackage={selectedPackage}
                search={search}
                showOldPackages={showOldPackages}
              />
            </TabPanel>
            <TabPanel value={display} index={"table"}>
              <AdviseTable
                search={selectedPackage ?? search}
                showOldPackages={showOldPackages}
              />
            </TabPanel>
            <TabPanel value={display} index={"file"}>
              <Typography variant="caption">
                <pre>
                  <div
                    className={classes.lockfile}
                    dangerouslySetInnerHTML={{
                      __html: JSON.stringify(
                        state?.advise?.report?.products?.[0]?.project
                          ?.requirements_locked,
                        undefined,
                        4
                      )?.replaceAll(
                        new RegExp(
                          '("' +
                            Object.keys(
                              state?.advise?.report?.products?.[0]?.project
                                ?.requirements_locked?.default
                            )?.join('"|"') +
                            '")',
                          "g"
                        ),
                        match => {
                          return `<a id="${match.slice(1, -1)}">${match}</a>`;
                        }
                      )
                    }}
                  />
                </pre>
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
