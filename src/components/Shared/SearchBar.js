// material ui
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

// react
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    flexGrow: 1
  }
}));

const SearchBar = ({ onChange, label }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TextField
        variant="outlined"
        label={label}
        className={classes.bar}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};

SearchBar.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default SearchBar;
