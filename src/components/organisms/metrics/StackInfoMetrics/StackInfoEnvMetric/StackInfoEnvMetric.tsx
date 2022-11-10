import React, { useMemo } from "react";
import { Chip } from "@mui/material";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DynamicCard from "components/molecules/DynamicCard";
import { useAdviseDocument } from "api";
import GridList from "components/molecules/GridList";

const StackInfoEnvMetric = ({ analysis_id }: { analysis_id?: string }) => {
  const { stack_info } = useAdviseDocument(analysis_id);

  const [metric, provided] = useMemo(() => {
    if (stack_info) {
      let p = 0;
      const m = stack_info
        .filter(info => info.link === "https://thoth-station.ninja/j/env")
        .map(info => {
          p += info.message.startsWith("No") ? 0 : 1;

          return {
            icon: info.message.startsWith("No") ? (
              <CloseRoundedIcon color="error" />
            ) : (
              <DoneRoundedIcon color="success" />
            ),
            title: info.message,
          };
        });

      return [m, p];
    }

    return [[], 0];
  }, [stack_info]);

  return (
    <DynamicCard
      title="Environment Parameters"
      subheader={`The advisor input was provided with ${provided} environment parameters`}
      avatar={<Chip icon={<InfoOutlinedIcon />} label={provided} color="info" />}
      url={"https://thoth-station.ninja/j/env"}
    >
      <GridList items={metric} />
    </DynamicCard>
  );
};

export default StackInfoEnvMetric;
