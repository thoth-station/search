import CategoryItem from "./CategoryItem";
import CompareItem from "./CompareItem";
import React from "react";

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

const FormItem = props => {
  const handleOperatorChange = value => {
    props.dispatch({
      param: props.param,
      payload: { operator: value, query: props.state?.[props.param]?.query }
    });
  };
  const handleQueryChange = value => {
    props.dispatch({
      param: props.param,
      payload: { operator: props.state?.[props.param]?.operator, query: value }
    });
  };

  return (
    <React.Fragment>
      {props.paramType === "category" ? (
        <CategoryItem
          {...props}
          stringCompare={stringCompare}
          numberCompare={numberCompare}
          handleQueryChange={handleQueryChange}
        />
      ) : (
        <CompareItem
          {...props}
          stringCompare={stringCompare}
          numberCompare={numberCompare}
          handleQueryChange={handleQueryChange}
          handleOperatorChange={handleOperatorChange}
        />
      )}
    </React.Fragment>
  );
};

export default FormItem;
