import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { ANALYSIS_ID } from "tests/defaults";

import ScorecardMetricComponent from "./ScorecardMetric";

export default {
  title: "organisms/ScorecardMetric",
  component: ScorecardMetricComponent,
  args: {
    package_name_override: "jinja2",
  },
} as ComponentMeta<typeof ScorecardMetricComponent>;

const Template: ComponentStory<typeof ScorecardMetricComponent> = args => <ScorecardMetricComponent {...args} />;

export const ScorecardMetric = Template.bind({});
ScorecardMetric.args = {
  analysis_id: ANALYSIS_ID,
  package_name: "numpy",
};
