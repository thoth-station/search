import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { ANALYSIS_ID } from "tests/defaults";

import DependencySummaryComponent from ".";

export default {
  title: "organisms/Summary Charts/DependencySummary",
  component: DependencySummaryComponent,
} as ComponentMeta<typeof DependencySummaryComponent>;

const Template: ComponentStory<typeof DependencySummaryComponent> = args => <DependencySummaryComponent {...args} />;

export const DependencySummary = Template.bind({});
DependencySummary.args = {
  analysis_id: ANALYSIS_ID,
};
