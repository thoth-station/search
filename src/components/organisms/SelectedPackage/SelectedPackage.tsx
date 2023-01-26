// React
import React, { useMemo } from "react";

// material-ui
import { Typography, Grid, Box, Link, Stack, CardHeader, CardContent, Card } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

// local
import IconText from "components/molecules/IconText";
import NetworkGraphView from "../DependencyGraph";
import ScorecardMetric from "components/organisms/ScorecardMetric";
import { LinkData, linkFilterFunction } from "./LinkData";

import InfoRoundedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberOutlined";
import { useNavigate } from "react-router-dom";
import CustomJustificationCard from "../CustomJustificationCard";
import { useAdviseDocument } from "api";
import { usePackageData } from "hooks/usePackageData";
import Loading from "components/atoms/Loading";

interface ISelectedPackage {
  analysis_id: string;
  selectedPackage: string;
  setSelectedPackage?: (key: string) => void;
}

/**
 * Renders the selected package context variable's data. It will preform
 * a search of the list of packages using the selected package variable.
 */
export const SelectedPackage = ({
  analysis_id,
  selectedPackage,
  setSelectedPackage = () => undefined,
}: ISelectedPackage) => {
  const { data: packageData, isLoading, isError, loadingText } = usePackageData(selectedPackage, analysis_id);
  const { justifications } = useAdviseDocument(analysis_id);

  const navigate = useNavigate();

  const packageJustifications = useMemo(() => {
    return justifications?.filter(j => (j as { package_name?: string }).package_name === selectedPackage);
  }, [justifications, selectedPackage]);

  const justificationCards = useMemo(() => {
    if (packageJustifications) {
      const cards = [
        <ScorecardMetric key="scorecard" analysis_id={analysis_id} package_name={selectedPackage} />,

        <CustomJustificationCard
          key="star"
          avatar={<StarRoundedIcon />}
          justification={packageJustifications.find(j => j.message.includes("popularity on GitHub"))}
        />,
      ];

      packageJustifications
        .filter(justification => {
          if (justification.link === "https://github.com/ossf/scorecard/blob/main/docs/checks.md") {
            return false;
          } else if (justification.message.includes("Thoth Search UI")) {
            return false;
          } else if (linkFilterFunction(justification.message)) {
            return false;
          }
          return true;
        })
        .forEach((justification, i) => {
          cards.push(
            <CustomJustificationCard
              key={justification.message + i}
              avatar={
                justification.type === "ERROR" ? (
                  <ErrorRoundedIcon color="error" />
                ) : justification.type === "WARNING" ? (
                  <WarningAmberRoundedIcon color="warning" />
                ) : (
                  <InfoRoundedIcon color="info" />
                )
              }
              justification={justification}
            />,
          );
        });

      return cards;
    }
  }, [packageJustifications]);

  const dependents = useMemo<string[]>(() => {
    const deps: string[] = [];

    if (packageData) {
      [...packageData.parents]
        .filter(p => p !== "*App")
        .forEach(node => {
          deps.push(node);
        });
    }

    return deps;
  }, [packageData]);

  const browseLink = useMemo(() => {
    if (packageJustifications) {
      const just = packageJustifications.find(s => s.message.includes("Thoth Search UI"));
      return just?.link;
    }
  }, [packageJustifications]);

  if (isLoading || isError || !packageData) {
    return <Loading isLoading={isLoading} isError={isError} loadingLabel={loadingText} />;
  }

  return (
    <Box sx={{ overflow: "scroll" }}>
      <Card variant="outlined" sx={{ padding: 2 }}>
        <Grid container alignItems="center" mb={1}>
          <Grid item>
            <Typography variant="h3">
              <Link underline="none" href={browseLink}>
                <b>{packageData?.name}</b>
              </Link>
            </Typography>
          </Grid>
          <Grid item>
            <Typography ml={2} variant="h6">
              {packageData.version}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid item>
            <IconText text={packageData.license ?? "NaN"} icon={<GavelIcon />} />
          </Grid>
          <LinkData justifications={packageJustifications} />
        </Grid>

        <Typography sx={{ marginTop: 2 }} variant="body1">
          {packageData.summary}
        </Typography>

        {!packageData.summary && (
          <Stack direction="row" alignItems="center" sx={{ marginTop: 2 }}>
            <ErrorRoundedIcon color="error" sx={{ marginRight: ".5rem" }} />
            <Typography mb={0} color="error" gutterBottom variant="body2">
              The package metadata could not be fetched.
            </Typography>
          </Stack>
        )}
      </Card>

      {justificationCards}

      <Card variant="outlined" sx={{ marginTop: 2 }}>
        <CardHeader
          title="Dependency Graph"
          subheader={
            <Typography variant="body1" mb={2}>
              {[...(packageData?.parents ?? [])].filter(p => p !== "*App")?.length === 0
                ? packageData.name + " is not a dependent of any package in this Python environment"
                : "There are " +
                  [...(packageData?.parents ?? [])].filter(p => p !== "*App")?.length +
                  " package(s) that have " +
                  packageData.name +
                  " as a direct dependency: "}
              {dependents.map((dep, i) => {
                return (
                  <React.Fragment key={dep + i}>
                    <Link
                      underline="hover"
                      onClick={() => {
                        setSelectedPackage(dep);
                        navigate("../packages/" + dep);
                      }}
                    >
                      {dep}
                    </Link>{" "}
                  </React.Fragment>
                );
              })}
            </Typography>
          }
        />
        <CardContent>
          <NetworkGraphView analysis_id={analysis_id} root={selectedPackage} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default SelectedPackage;
