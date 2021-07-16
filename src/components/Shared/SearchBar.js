// material ui
import { TextField, Box } from "@material-ui/core";
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

const SearchBar = props => {
  const { onChange, label, helperText, boxprops, error = false } = props;
  const classes = useStyles();

  return (
    <Box className={classes.root} {...boxprops}>
      <TextField
        variant="outlined"
        label={label}
        onChange={e => onChange(e.target.value)}
        helperText={helperText}
        error={error}
        {...props}
      />
    </Box>
  );
};

SearchBar.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  helperText: PropTypes.string,
  error: PropTypes.bool
};

export default SearchBar;
