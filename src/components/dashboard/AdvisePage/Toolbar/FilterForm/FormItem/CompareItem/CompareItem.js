// material-ui
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  TextField
} from "@material-ui/core";

const CompareItem = ({ handleQueryChange, handleOperatorChange, ...props }) => {
  return (
    <Grid container item xs={12} spacing={2} alignItems="center">
      <Grid item xs={4}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {props.paramDisplay}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Select
          value={props.state?.[props.param]?.operator}
          onChange={event => handleOperatorChange(event.target.value)}
          size="small"
          variant="standard"
          fullWidth
        >
          {(props.paramType === "string"
            ? props.stringCompare
            : props.numberCompare
          ).map(([label, value]) => {
            return (
              <MenuItem key={label + props.param} value={value}>
                {label}
              </MenuItem>
            );
          })}
        </Select>
      </Grid>
      <Grid xs item>
        <TextField
          size="small"
          variant="standard"
          value={props.state?.[props.param]?.query}
          fullWidth
          onChange={event => handleQueryChange(event.target.value)}
        />
      </Grid>
    </Grid>
  );
};

export default CompareItem;
