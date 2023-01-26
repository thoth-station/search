import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import GridList from ".";

export default {
  title: "molecules/GridList",
  component: GridList,
  args: {
    items: [{ title: "Item 1" }, { title: "Item 2" }, { title: "Item 3" }, { title: "Item 4" }],
  },
} as ComponentMeta<typeof GridList>;

const Template: ComponentStory<typeof GridList> = args => <GridList {...args} />;

export const Primary = Template.bind({});

export const Button = Template.bind({});
Button.args = {
  isButton: true,
};
