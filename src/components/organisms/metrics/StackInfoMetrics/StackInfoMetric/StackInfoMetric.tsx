import React, { useMemo } from "react";
import { Box, Chip, IconButton, Stack, Typography } from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

import { components } from "lib/schema";
import DynamicCard from "components/molecules/DynamicCard";
import GridList from "components/molecules/GridList";
import { useAdviseDocument } from "api";

const StackInfoMetric = ({
  analysis_id,
  ignoreLinks = [
    "https://thoth-station.ninja/j/install_error",
    "https://thoth-station.ninja/j/env",
    "https://thoth-station.ninja/j/rules",
  ],
}: {
  analysis_id: string;
  ignoreLinks?: string[];
}) => {
  const { stack_info } = useAdviseDocument(analysis_id);

  const [recommendedItems, otherItems, typeTotals] = useMemo(() => {
    if (stack_info) {
      const types = new Set<string>();
      stack_info.forEach(i => types.add(i.link));

      const metrics = new Map<string, components["schemas"]["StackInfo"]>();
      stack_info
        .filter(info => !ignoreLinks.includes(info.link) && types.has(info.link))
        .forEach(info => {
          metrics.set(info.link, (metrics.get(info.link) ?? []).concat(info));
        });

      const formatData = ([, value]: [string, components["schemas"]["StackInfo"]]) => {
        return {
          title: value.map((v: { message: string }) => (
            <Typography key={v.message} variant="body2">
              {v.message}
            </Typography>
          )),
          icon: (
            <Box display="flex" alignContent="center">
              {value[0].type === "ERROR" ? (
                <ErrorOutlineOutlinedIcon color="error" />
              ) : value[0].type === "WARNING" ? (
                <WarningAmberOutlinedIcon color="warning" />
              ) : (
                <InfoOutlinedIcon color="info" />
              )}
            </Box>
          ),
          action: (
            <IconButton href={value[0].link} target="_blank" rel="noopener noreferrer">
              <OpenInNewRoundedIcon />
            </IconButton>
          ),
        };
      };

      const recommended = Array.from(metrics.entries())
        .filter(([, value]) =>
          value.some((v: { message: string }) => v.message.includes("use") || v.message.includes("Use")),
        )
        .map(formatData);

      const other = Array.from(metrics.entries())
        .filter(([, value]) =>
          value.some((v: { message: string }) => !v.message.includes("use") || v.message.includes("Use")),
        )
        .map(formatData);

      return [
        recommended,
        other,
        {
          info: Array.from(metrics.values()).reduce((p, c) => p + (c[0].type === "INFO" ? 1 : 0), 0),
          warning: Array.from(metrics.values()).reduce((p, c) => p + (c[0].type === "WARNING" ? 1 : 0), 0),
          error: Array.from(metrics.values()).reduce((p, c) => p + (c[0].type === "ERROR" ? 1 : 0), 0),
        },
      ];
    }

    return [null, null, null];
  }, [stack_info]);

  return (
    <DynamicCard
      title="Other Stack Info"
      avatar={
        <Stack direction="row" spacing={1}>
          {typeTotals?.info ? <Chip icon={<InfoOutlinedIcon />} label={typeTotals.info} color="info" /> : undefined}
          {typeTotals?.warning ? (
            <Chip icon={<WarningAmberOutlinedIcon />} label={typeTotals.warning} color="warning" />
          ) : undefined}
          {typeTotals?.error ? (
            <Chip icon={<ErrorOutlineOutlinedIcon />} label={typeTotals.error} color="error" />
          ) : undefined}
        </Stack>
      }
    >
      <Typography variant="body1" fontWeight="bolder">
        Recommended Actions
      </Typography>
      <GridList items={recommendedItems ?? []} />
      <Typography variant="body1" fontWeight="bolder">
        Other Information
      </Typography>
      <GridList items={otherItems ?? []} />
    </DynamicCard>
  );
};

export default StackInfoMetric;
