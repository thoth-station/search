// react
import React from "react";

interface IProps {
  /** card header info */
  cardMeta: {
    /** card title */
    title: string;
    /** optional subtitle */
    subTitle?: string;
  };
  /** optional card action component (usually some button) */
  cardAction?: React.ReactNode;
  /** Card body content */
  cardBody: React.ReactNode;
}
import { Card, CardContent, CardHeader, Typography } from "@mui/material";

/** Card template for metric cards. */
const InfoCard = ({ cardMeta, cardBody, cardAction }: IProps) => {
  return (
    <Card variant="outlined" sx={{ margin: 0 }}>
      <CardHeader
        action={cardAction}
        title={<Typography variant="h5">{cardMeta.title}</Typography>}
        subheader={cardMeta.subTitle}
      />
      <CardContent>{cardBody}</CardContent>
    </Card>
  );
};

export default InfoCard;
