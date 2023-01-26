import React, { useMemo } from "react";
import { Chip, Divider, Grid, Typography } from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DynamicCard from "components/molecules/DynamicCard";
import GridList from "components/molecules/GridList";
import { useAdviseDocument } from "api";

const StackInfoRulesMetric = ({ analysis_id }: { analysis_id: string }) => {
  const { stack_info } = useAdviseDocument(analysis_id);

  const metric = useMemo(() => {
    if (stack_info) {
      const rules = new Map<string, { package: string; constraint: string; index: string }[]>();
      stack_info
        .filter(info => info.link === "https://thoth-station.ninja/j/rules")
        .forEach(pkg => {
          const name_constraint_index_pattern = /(?<=').*?(?=')/g;
          const rule_pattern = /(?<=rule: ).*/;
          const name_constraint_index = pkg.message.match(name_constraint_index_pattern);
          const rule = pkg.message.match(rule_pattern);
          if (name_constraint_index && rule) {
            rules.set(
              rule[0],
              (rules.get(rule[0]) ?? []).concat({
                package: name_constraint_index?.[0],
                constraint: name_constraint_index?.[2],
                index: name_constraint_index?.[4],
              }),
            );
          }
        });

      return Array.from(rules.entries()).map(([rule, value]) => {
        return {
          title: rule,
          expandedContent: (
            <Grid
              container
              sx={{
                marginLeft: 1,
                paddingRight: 1,
              }}
            >
              <Grid item xs={5}>
                <Typography variant="body2">Package</Typography>
              </Grid>
              <Grid item xs={2} textAlign="center">
                <Typography variant="body2">Constraint</Typography>
              </Grid>
              <Grid item xs={5} textAlign="right">
                <Typography variant="body2">Index</Typography>
              </Grid>
              <Grid item xs={12} sx={{ marginBottom: 1 }}>
                <Divider flexItem />
              </Grid>
              {value.map(pkg => {
                return (
                  <React.Fragment key={pkg.package + pkg.index}>
                    <Grid item xs={5}>
                      {pkg.package}
                    </Grid>
                    <Grid item xs={2} textAlign="center">
                      {pkg.constraint}
                    </Grid>
                    <Grid item xs={5} textAlign="right">
                      {pkg.index}
                    </Grid>
                  </React.Fragment>
                );
              })}
            </Grid>
          ),
        };
      });
    } else return [];
  }, []);

  return (
    <DynamicCard
      title="Solver Rules"
      subheader="One or multiple packages were removed based on Python solver rules configured"
      avatar={<Chip icon={<ErrorOutlineOutlinedIcon />} label={metric.length} color="error" />}
      url="https://thoth-station.ninja/j/install_error"
    >
      <GridList primaryTypographyProps={{ variant: "button", fontWeight: "bold" }} isButton items={metric} />
    </DynamicCard>
  );
};

export default StackInfoRulesMetric;
