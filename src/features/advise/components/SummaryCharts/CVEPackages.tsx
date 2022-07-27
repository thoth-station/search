import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { OpenSourceVulnerabilityFormat } from "../../hooks/useImportantJustifications";
import { Link } from "react-router-dom";

interface ICVEPackages {
  cvePackages?: {
    data?: Map<
      string,
      {
        packages: { name: string; version: string; index: string }[];
        report?: OpenSourceVulnerabilityFormat;
      }
    >;
  };
}

export const CVEPackages = ({ cvePackages }: ICVEPackages) => {
  const [selectedCVE, setSelectedCVE] = useState<OpenSourceVulnerabilityFormat | null>(null);
  const containerRef = React.useRef(null);

  if (!cvePackages) {
    return (
      <>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="rectangular" height={118} />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </>
    );
  } else if (!cvePackages.data) {
    return null;
  }

  return (
    <Card variant="outlined" ref={containerRef}>
      <CardHeader
        title="CVE Warnings"
        subheader="Security advisories for packages published on PyPI"
        action={
          <IconButton href="https://thoth-station.ninja/j/cve" target="_blank" rel="noopener noreferrer">
            <OpenInNewRoundedIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Slide direction="right" in={selectedCVE !== null} container={containerRef.current}>
          <div>
            {selectedCVE !== null ? (
              <React.Fragment>
                <Stack alignItems="center" direction="row">
                  <IconButton size="small" onClick={() => setSelectedCVE(null)}>
                    <NavigateNextRoundedIcon sx={{ transform: "rotate(180deg)" }} />
                  </IconButton>
                  <Typography variant="h5" fontWeight="bold">
                    {selectedCVE?.id}
                  </Typography>
                </Stack>
                {selectedCVE.id ? (
                  <>
                    <Typography sx={{ marginLeft: 4 }} variant="subtitle2" fontStyle="italic" color="gray">
                      Published: {new Date(selectedCVE?.published).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: 2 }}>
                      {selectedCVE?.details}
                    </Typography>
                    <Typography sx={{ marginTop: 2 }} variant="h6" fontWeight="bold">
                      Affected Packages
                    </Typography>
                    {selectedCVE?.affected?.map((pkg, i) => (
                      <Box sx={{ marginBottom: 1 }} key={pkg?.package?.name + i}>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="body1" color="gray">{`[${pkg?.package?.ecosystem}]`}</Typography>
                          <Typography variant="body1">
                            {" "}
                            <Link replace to={"../packages/" + pkg?.package?.name}>
                              {pkg?.package?.name}
                            </Link>
                          </Typography>
                        </Stack>
                        {pkg?.ranges?.map((range, j) => (
                          <Grid
                            container
                            key={range.type + j + i}
                            sx={{
                              marginLeft: 2,
                              marginTop: 0.5,
                            }}
                          >
                            <Grid item xs={2}>
                              <Typography variant="body2" fontWeight="bold">
                                Type
                              </Typography>
                            </Grid>
                            <Grid item xs={10}>
                              <Typography variant="body2">{range.type}</Typography>
                            </Grid>

                            <Grid item xs={2}>
                              <Typography variant="body2" fontWeight="bold">
                                Events
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={10}
                              sx={{
                                marginBottom: 2,
                              }}
                            >
                              {range.events.map((event, k) => (
                                <Grid container key={"event" + i + j + k} direction="row" spacing={1}>
                                  <Grid item xs={3}>
                                    <Typography variant="body2" fontWeight="bold">
                                      {event.fixed ? "Fixed" : "Introduced"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={9}>
                                    <Typography variant="body2">{event.introduced ?? event.fixed}</Typography>
                                  </Grid>
                                </Grid>
                              ))}
                            </Grid>
                          </Grid>
                        ))}
                      </Box>
                    ))}
                  </>
                ) : (
                  <Typography variant="body2" color="red" textAlign="center">
                    Unable to fetch CVE details
                  </Typography>
                )}
              </React.Fragment>
            ) : undefined}
          </div>
        </Slide>
        <Slide direction="left" in={selectedCVE === null} container={containerRef.current}>
          <div>
            {selectedCVE === null ? (
              <List disablePadding dense>
                {Array.from(cvePackages.data.entries()).map(([cve, value]) => (
                  <ListItem disablePadding dense key={cve}>
                    <ListItemButton onClick={() => setSelectedCVE(value.report ?? null)}>
                      <ListItemText
                        primary={cve}
                        secondary={value.packages.map(pkg => `${pkg.name} ${pkg.version}`).join(", ")}
                      />
                      <ListItemIcon>
                        <NavigateNextRoundedIcon />
                      </ListItemIcon>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : undefined}
          </div>
        </Slide>
      </CardContent>
    </Card>
  );
};
