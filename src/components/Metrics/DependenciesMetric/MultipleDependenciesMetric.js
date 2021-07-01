// react
import React from "react";
import PropTypes from "prop-types";

// local
import ProgressBar from "components/Shared/ProgressBar";

// material-ui
import { makeStyles } from "@material-ui/core/styles";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Collapse
} from "@material-ui/core/";

const useStyles = makeStyles(theme => ({
  bar: {
    marginBottom: theme.spacing(1)
  },
  totals: {
    display: "flex"
  }
}));

const MultipleDependenciesMetric = ({ metric }) => {
  const classes = useStyles();
  const totalDependencies =
    (metric.all.direct ?? 0) +
    (metric.all.indirect ?? 0) +
    (metric.all.roots ?? 0);

  const [open, setOpen] = React.useState("");

  const handleExpand = key => {
    if (open === key) {
      setOpen("");
    } else {
      setOpen(key);
    }
  };

  return (
    <div>
      <div className={classes.totals}>
        <Typography variant="body2" gutterBottom>
          <b>All Packages</b>
        </Typography>
        <Divider />
        <ProgressBar
          value={metric.all.roots ?? 0}
          total={totalDependencies}
          label={"Root"}
          className={classes.bar}
        />
        <ProgressBar
          value={metric.all.direct ?? 0}
          total={totalDependencies}
          label={"Direct"}
          className={classes.bar}
        />
        <ProgressBar
          value={metric.all.indirect ?? 0}
          total={totalDependencies}
          label={"Indirect"}
        />
      </div>
      <List component="nav">
        {Object.entries(metric.roots).map(([key, value], i) => {
          return (
            <>
              <ListItem key={key} button onClick={() => handleExpand(key)}>
                <ListItemText primary={value.label} />
                {open === key ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse key={key + i} in={open} timeout="auto" unmountOnExit>
                <ProgressBar
                  value={metric.roots[key].direct ?? 0}
                  total={totalDependencies}
                  label={"Direct"}
                  className={classes.bar}
                />
                <ProgressBar
                  value={metric.roots[key].indirect ?? 0}
                  total={totalDependencies}
                  label={"Indirect"}
                />
              </Collapse>
            </>
          );
        })}
      </List>
    </div>
  );
};

MultipleDependenciesMetric.propTypes = {
  metric: PropTypes.shape({
    all: PropTypes.shape({
      direct: PropTypes.number,
      indirect: PropTypes.number,
      roots: PropTypes.number
    })
  })
};

export default MultipleDependenciesMetric;
