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

const SearchBar = ({ onChange, label, helperText, error = false }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TextField
        type="search"
        variant="outlined"
        label={label}
        className={classes.bar}
        onChange={e => onChange(e.target.value)}
        helperText={helperText}
        error={error}
      />
    </div>
  );
};

SearchBar.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  helperText: PropTypes.string,
  error: PropTypes.bool
};

export default SearchBar;
