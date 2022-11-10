import React, { useMemo } from "react";
import { Chip, ListItem, ListItemText } from "@mui/material";

import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useAdviseDocument } from "api";
import DynamicCard from "components/molecules/DynamicCard";
import GridList from "components/molecules/GridList";

export const StackInfoInstallErrorMetric = ({ analysis_id }: { analysis_id?: string }) => {
  const { stack_info } = useAdviseDocument(analysis_id);

  const metric = useMemo(() => {
    if (stack_info) {
      return stack_info
        .filter(info => info.link === "https://thoth-station.ninja/j/install_error")
        .map(pkg => {
          const name_index = pkg.message.match(/(?<=').*?(?=')/g);
          const versions = pkg.message.match(/(?<=environment: ).*/);
          return {
            title: name_index?.[0] ?? "_unknown",
            subtitle: name_index?.[2],
            expandedContent: (
              <ListItem>
                <ListItemText inset secondary={versions?.[0]} />
              </ListItem>
            ),
            icon: <Chip label={versions?.[0].split(", ").length} color="error" />,
          };
        })
        .filter(v => v.title !== "_unknown");
    } else return [];
  }, []);

  return (
    <DynamicCard
      title="Installation Errors"
      subheader="The given package & version combinations were removed from the resolution process as they produced errors during installation in the given environment"
      avatar={<Chip icon={<ErrorOutlineOutlinedIcon />} label={metric.length} color="error" />}
      url="https://thoth-station.ninja/j/install_error"
    >
      <GridList isButton items={metric} />
    </DynamicCard>
  );
};

export default StackInfoInstallErrorMetric;
