import { ToggleButtonGroup, ToggleButton } from "@material-ui/core";

const CustomCardAction = ({ value, onChange }) => {
  return (
    <ToggleButtonGroup value={value} exclusive size="small" onChange={onChange}>
      <ToggleButton value="old">Old</ToggleButton>
      <ToggleButton value="new">New</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default CustomCardAction;
