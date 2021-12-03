// react
import React from "react";
import PropTypes from "prop-types";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Card, CardContent, CardHeader, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    height: "100%"
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

/** Card template for metric cards. */
const InfoCard = ({ cardMeta, cardBody, cardAction }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        action={cardAction}
        title={<Typography variant="h5">{cardMeta.title}</Typography>}
        subheader={cardMeta.subTitle}
      />
      <CardContent>{cardBody}</CardContent>
    </Card>
  );
};

InfoCard.propTypes = {
  /** card header info */
  cardMeta: PropTypes.shape({
    /** card title */
    title: PropTypes.string.isRequired,
    /** optional subtitle */
    subTitle: PropTypes.string,
  }),
  /** optional card action component (usually some button) */
  cardAction: PropTypes.element,
  /** Card body content */
  cardBody: PropTypes.element
};

export default InfoCard;
