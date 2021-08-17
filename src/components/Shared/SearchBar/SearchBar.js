// material ui
import { Typography, Box, Paper, InputBase } from "@material-ui/core";

// react
import PropTypes from "prop-types";

const SearchBar = props => {
  const {
    onChange,
    label,
    helpertext,
    boxprops,
    error = false,
    lefticon,
    righticon
  } = props;

  return (
    <Box>
      <Typography
        variant={"body1"}
        sx={{ color: error ? "error.main" : "text.secondary" }}
      >
        {label}
      </Typography>
      <Paper
        component="form"
        variant="outlined"
        sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}
        {...boxprops}
      >
        {lefticon}
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={helpertext}
          error={error}
          onChange={e => onChange(e.target.value)}
          {...props}
        />
        {righticon}
      </Paper>
    </Box>
  );
};

SearchBar.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  helpertext: PropTypes.string,
  error: PropTypes.bool
};

export default SearchBar;
