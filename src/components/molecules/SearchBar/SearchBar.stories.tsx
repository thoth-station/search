import { ComponentStory, ComponentMeta } from "@storybook/react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import React from "react";

import SearchBar from ".";

export default {
  title: "molecules/SearchBar",
  component: SearchBar,
} as ComponentMeta<typeof SearchBar>;

const Template: ComponentStory<typeof SearchBar> = args => <SearchBar {...args} />;

export const Primary = Template.bind({});
Primary.args = {};

export const Text = Template.bind({});
Text.args = {
  label: "Search Bar",
  helpertext: "search...",
};

export const Error = Template.bind({});
Error.args = {
  label: "Error Bar",
  error: true,
};

export const IconsLeft = Template.bind({});
IconsLeft.args = {
  label: "Label Bar",
  lefticon: <SearchRoundedIcon />,
};

export const IconsRight = Template.bind({});
IconsRight.args = {
  label: "Label Bar",
  righticon: <SearchRoundedIcon />,
};
