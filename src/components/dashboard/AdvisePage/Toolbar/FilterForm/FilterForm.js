// react
import React, { useReducer } from "react";

// material-ui
import {
  Grid,
  Button,
  FormControlLabel,
  Checkbox,
  Divider
} from "@material-ui/core";

// local
import FormItem from "./FormItem";

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

  return (
    <Grid container alignItems="center">
      {params.map(([param, paramDisplay, paramType, paramCategory]) => {
        return (
          <FormItem
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
      <Grid container justifyContent="flex-end" item xs={12} mt={2} mb={1}>
        <Grid item xs={4} align="end" mr={4}>
          <Button onClick={clearFilters}>Clear filter</Button>
        </Grid>
        <Grid item align="start">
          <Button variant="contained" onClick={() => applyFilter(state)}>
            Search
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FilterForm;
