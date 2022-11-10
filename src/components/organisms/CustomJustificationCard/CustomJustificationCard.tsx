import React from "react";
import { CardHeader, Card, IconButton } from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { components } from "lib/schema";

interface ICustomJustificationCard {
  justification?: components["schemas"]["Justification"][number];
  avatar?: JSX.Element & React.ReactNode;
}

const CustomJustificationCard = ({ justification, avatar }: ICustomJustificationCard) => {
  if (!justification) {
    return null;
  }

  return (
    <Card variant="outlined" sx={{ marginTop: 2 }}>
      <CardHeader
        title={justification.message}
        action={
          <IconButton href={justification.link} target="_blank" rel="noopener noreferrer">
            <OpenInNewRoundedIcon />
          </IconButton>
        }
        avatar={avatar}
      />
    </Card>
  );
};

export default CustomJustificationCard;
