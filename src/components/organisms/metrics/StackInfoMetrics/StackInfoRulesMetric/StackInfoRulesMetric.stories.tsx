import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { ANALYSIS_ID } from "tests/defaults";

import StackInfoRulesMetricComponent from ".";

export default {
  title: "organisms/metrics/StackInfoRulesMetric",
  component: StackInfoRulesMetricComponent,
} as ComponentMeta<typeof StackInfoRulesMetricComponent>;

const Template: ComponentStory<typeof StackInfoRulesMetricComponent> = args => (
  <StackInfoRulesMetricComponent {...args} />
);

export const StackInfoRulesMetric = Template.bind({});
StackInfoRulesMetric.args = {
  analysis_id: ANALYSIS_ID,
};
