// react
import React from "react";
import PropTypes from "prop-types";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Card, CardContent, CardHeader } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    minWidth: 275
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

const InfoCard = ({ cardMeta, cardBody }) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardHeader
        action={cardMeta.action}
        title={cardMeta.title}
        subheader={cardMeta.subTitle}
      />
      <CardContent>{cardBody}</CardContent>
    </Card>
  );
};

InfoCard.propTypes = {
  cardMeta: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    action: PropTypes.element
  }),
  cardBody: PropTypes.element
};

export default InfoCard;
