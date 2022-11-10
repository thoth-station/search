import { WarningAmberRounded } from "@mui/icons-material";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import DropdownListItem from ".";

export default {
  title: "molecules/DropdownListItem",
  component: DropdownListItem,
  args: {
    title: "Example Title",
  },
} as ComponentMeta<typeof DropdownListItem>;

const Template: ComponentStory<typeof DropdownListItem> = args => (
  <DropdownListItem {...args}>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
  </DropdownListItem>
);

export const Primary = Template.bind({});
Primary.args = {};

export const Icon = Template.bind({});
Icon.args = {
  icon: <WarningAmberRounded color="error" />,
};
