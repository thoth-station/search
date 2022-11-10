import React from "react";
import { Card, CardContent, CardHeader, IconButton, Stack } from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

import { ScorecardItem } from "./ScorecardItem";
import { useScorecard } from "./useScorecard";
import { useAdviseDocument } from "api";

interface IScorecardMetric {
  package_name: string;
  analysis_id: string;
}

const ScorecardMetric = ({ package_name, analysis_id }: IScorecardMetric) => {
  const { justifications } = useAdviseDocument(analysis_id);
  const scorecard = useScorecard(package_name, justifications);

  return (
    <Card variant="outlined" sx={{ marginTop: 2 }}>
      <CardHeader
        title="Security Scorecards"
        subheader={`Scorecards give consumers of open-source projects an easy way to judge whether their dependencies are safe.`}
        action={
          <IconButton
            href={"https://github.com/ossf/scorecard/blob/main/docs/checks.md"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <OpenInNewRoundedIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Stack>
          {scorecard.map(value => {
            return <ScorecardItem key={value.name} {...value} />;
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ScorecardMetric;
