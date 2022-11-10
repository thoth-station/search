import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { ANALYSIS_ID } from "tests/defaults";

import StackInfoInstallErrorMetricComponent from ".";

export default {
  title: "organisms/metrics/StackInfoInstallErrorMetric",
  component: StackInfoInstallErrorMetricComponent,
} as ComponentMeta<typeof StackInfoInstallErrorMetricComponent>;

const Template: ComponentStory<typeof StackInfoInstallErrorMetricComponent> = args => (
  <StackInfoInstallErrorMetricComponent {...args} />
);

export const StackInfoInstallErrorMetric = Template.bind({});
StackInfoInstallErrorMetric.args = {
  analysis_id: ANALYSIS_ID,
};
