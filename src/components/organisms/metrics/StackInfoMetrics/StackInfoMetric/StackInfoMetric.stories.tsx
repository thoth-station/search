import { Stack } from "@mui/system";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { ANALYSIS_ID } from "tests/defaults";

import StackInfoMetricComponent from ".";

export default {
  title: "organisms/metrics/StackInfoMetric",
  component: StackInfoMetricComponent,
} as ComponentMeta<typeof StackInfoMetricComponent>;

const Template: ComponentStory<typeof StackInfoMetricComponent> = args => <StackInfoMetricComponent {...args} />;

export const StackInfoMetric = Template.bind({});
StackInfoMetric.args = {
  analysis_id: ANALYSIS_ID,
};
