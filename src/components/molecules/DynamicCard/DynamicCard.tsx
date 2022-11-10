import React from "react";
import { Card, CardContent, CardHeader, IconButton } from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

interface IDynamicCard {
  url?: string;
  title: string;
  avatar?: React.ReactNode;
  subheader?: string;
  children: React.ReactNode;
}

const DynamicCard = ({ url, title, avatar, subheader, children }: IDynamicCard) => {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <React.Fragment key={url}>
      {compact ? (
        <Card variant="outlined">
          <CardHeader
            title={title}
            titleTypographyProps={{
              variant: "h6",
            }}
            action={
              url ? (
                <IconButton href={url ?? ""} target="_blank" rel="noopener noreferrer">
                  <OpenInNewRoundedIcon />
                </IconButton>
              ) : undefined
            }
            avatar={avatar}
          />
        </Card>
      ) : (
        <Card variant="outlined">
          <CardHeader
            title={title}
            subheader={subheader}
            action={
              url ? (
                <IconButton href={url ?? ""} target="_blank" rel="noopener noreferrer">
                  <OpenInNewRoundedIcon />
                </IconButton>
              ) : undefined
            }
          />
          <CardContent>{children}</CardContent>
        </Card>
      )}
    </React.Fragment>
  );
};

export default DynamicCard;
