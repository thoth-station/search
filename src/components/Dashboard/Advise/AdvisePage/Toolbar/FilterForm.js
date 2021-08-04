// react
import React, { useReducer } from "react";

// material-ui
import {
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";

const FilterFormItem = ({
  dispatch,
  state,
  param,
  paramType,
  paramDisplay,
  paramCategory
}) => {
  const numberCompare = [
    ["equal to", "="],
    ["not equal to", "!="],
    ["greater than", ">"],
    ["greater than or equal to", ">="],
    ["less than", "<"],
    ["less than or equal to", "<="]
  ];

  const stringCompare = [
    ["equal to", "="],
    ["not equal to", "!="],
    ["contains", "~"],
    ["does not contain", "!~"]
  ];

  const handleOperatorChange = value => {
    dispatch({
      param: param,
      payload: { operator: value, query: state?.[param]?.query }
    });
  };
  const handleQueryChange = value => {
    dispatch({
      param: param,
      payload: { operator: state?.[param]?.operator, query: value }
    });
  };

  const categoryType = () => {
    return (
      <Grid container item xs={12} spacing={2} alignItems="center">
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {paramDisplay}
          </Typography>
        </Grid>
        <Grid item xs>
          <Select
            value={state?.[param]?.query}
            displayEmpty
            onChange={event => {
              handleQueryChange(event.target.value);
            }}
            size="small"
            variant="standard"
            fullWidth
          >
            {paramCategory.map((value, index) => {
              return (
                <MenuItem key={value + param} value={value}>
                  {value}
                </MenuItem>
              );
            })}
          </Select>
        </Grid>
      </Grid>
    );
  };

  const comapareType = () => {
    return (
      <Grid container item xs={12} spacing={2} alignItems="center">
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {paramDisplay}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Select
            value={state?.[param]?.operator}
            onChange={event => handleOperatorChange(event.target.value)}
            size="small"
            variant="standard"
            fullWidth
          >
            {(paramType === "string" ? stringCompare : numberCompare).map(
              ([label, value]) => {
                return (
                  <MenuItem key={label + param} value={value}>
                    {label}
                  </MenuItem>
                );
              }
            )}
          </Select>
        </Grid>
        <Grid xs item>
          <TextField
            size="small"
            variant="standard"
            value={state?.[param]?.query}
            fullWidth
            onChange={event => handleQueryChange(event.target.value)}
          />
        </Grid>
      </Grid>
    );
  };

  const renderType = () => {
    switch (paramType) {
      case "category":
        return categoryType();
      default:
        return comapareType();
    }
  };

  return <React.Fragment>{renderType()}</React.Fragment>;
};

const FilterForm = ({ applyFilter, initialFilter }) => {
  // state reducer function
  function reducer(state, action) {
    if (!action?.param) {
      return initialFilter;
    } else {
      return { ...state, [action.param]: action.payload };
    }
  }

  const [state, dispatch] = useReducer(reducer, initialFilter);

  const clearFilters = () => {
    dispatch();
    applyFilter(initialFilter);
  };

  const params = [
    ["id", "Package name", "string"],
    ["version", "Package version", "string"],
    ["license", "Package license", "string"],
    ["depth", "Distance from root packages", "number"],
    ["depenencies", "Package depenencies count", "number"],
    ["lockfile", "Which Pipfile.lock", "category", ["new", "old", "both"]],
    [
      "change",
      "Package change type",
      "category",
      ["added", "removed", "version", "unchanged"]
    ]
  ];

  return (
    <Grid container alignItems="center">
      {params.map(([param, paramDisplay, paramType, paramCategory]) => {
        return (
          <FilterFormItem
            state={state}
            dispatch={dispatch}
            param={param}
            paramDisplay={paramDisplay}
            paramType={paramType}
            paramCategory={paramCategory}
            key={param + paramType}
          />
        );
      })}
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={state?.between?.query}
              onChange={event =>
                dispatch({
                  param: "between",
                  payload: { query: event.target.checked }
                })
              }
              name="checkedA"
            />
          }
          label="Include packages that are in paths from filtered to root"
        />
      </Grid>
      <Grid container justifyContent="flex-end" item xs={12} mt={2}>
        <Grid item xs={3}>
          <Button onClick={clearFilters}>Clear filter</Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" onClick={() => applyFilter(state)}>
            Search
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FilterForm;
