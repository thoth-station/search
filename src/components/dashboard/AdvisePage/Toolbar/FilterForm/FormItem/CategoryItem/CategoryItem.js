// material-ui
import { Grid, Typography, Select, MenuItem } from "@material-ui/core";

const CategoryItem = ({ handleQueryChange, ...props }) => {
  return (
    <Grid container item xs={12} spacing={2} alignItems="center">
      <Grid item xs={4}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {props.paramDisplay}
        </Typography>
      </Grid>
      <Grid item xs>
        <Select
          value={props.state?.[props.param]?.query}
          displayEmpty
          onChange={event => {
            handleQueryChange(event.target.value);
          }}
          size="small"
          variant="standard"
          fullWidth
        >
          {props.paramCategory.map((value, index) => {
            return (
              <MenuItem key={value + props.param} value={value}>
                {value}
              </MenuItem>
            );
          })}
        </Select>
      </Grid>
    </Grid>
  );
};

export default CategoryItem;
