import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { ANALYSIS_ID } from "tests/defaults";

import StackInfoEnvMetricComponent from ".";

export default {
  title: "organisms/metrics/StackInfoEnvMetric",
  component: StackInfoEnvMetricComponent,
} as ComponentMeta<typeof StackInfoEnvMetricComponent>;

const Template: ComponentStory<typeof StackInfoEnvMetricComponent> = args => <StackInfoEnvMetricComponent {...args} />;

export const StackInfoEnvMetric = Template.bind({});
StackInfoEnvMetric.args = {
  analysis_id: ANALYSIS_ID,
};
