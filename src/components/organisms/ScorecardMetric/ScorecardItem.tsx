import React from "react";
import { Chip, Grid, Stack, Typography } from "@mui/material";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DropdownListItem from "components/molecules/DropdownListItem/DropdownListItem";

type ScoreCardItemProp = {
  tags: string;
  name: string;
  short: string;
  risk: string;
  passing?: boolean;
  justification?: string;
};
export const ScorecardItem = ({ tags, name, short, risk, passing, justification }: ScoreCardItemProp) => {
  return (
    <DropdownListItem
      title={name}
      icon={!passing ? <CloseRoundedIcon color="error" /> : <DoneRoundedIcon color="success" />}
    >
      <Grid container sx={{ marginLeft: 5, marginBottom: 1, paddingRight: 1 }}>
        <Grid item xs={12} sx={{ marginBottom: 2 }}>
          <Typography variant="body2">{short}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography fontWeight="bolder" variant="body2">
            Reason
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ marginBottom: 1 }}>
          <Typography variant="body2">{justification}</Typography>
        </Grid>
        <Grid item xs={12} sx={{ marginBottom: 1 }}>
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography variant="body2">risk: </Typography>
            <Chip size="small" label={risk} color={risk === "High" ? "error" : risk == "Medium" ? "warning" : "info"} />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack alignItems="center" direction="row" spacing={1}>
            <Typography variant="body2">tags: </Typography>
            {tags.split(", ").map(tag => {
              return <Chip size="small" key={tag} label={tag} />;
            })}
          </Stack>
        </Grid>
      </Grid>
    </DropdownListItem>
  );
};
