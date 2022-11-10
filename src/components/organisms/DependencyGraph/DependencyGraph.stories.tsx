import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { ANALYSIS_ID } from "tests/defaults";

import DependencyGraph from ".";

export default {
  title: "organisms/DependencyGraph",
  component: DependencyGraph,
} as ComponentMeta<typeof DependencyGraph>;

const Template: ComponentStory<typeof DependencyGraph> = args => <DependencyGraph {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  analysis_id: ANALYSIS_ID,
  root: "numpy",
};
