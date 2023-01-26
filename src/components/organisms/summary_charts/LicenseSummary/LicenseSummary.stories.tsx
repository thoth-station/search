import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { ANALYSIS_ID } from "tests/defaults";

import LicenseSummaryComponent from ".";

export default {
  title: "organisms/Summary Charts/LicenseSummary",
  component: LicenseSummaryComponent,
} as ComponentMeta<typeof LicenseSummaryComponent>;

const Template: ComponentStory<typeof LicenseSummaryComponent> = args => <LicenseSummaryComponent {...args} />;

export const LicenseSummary = Template.bind({});
LicenseSummary.args = {
  analysis_id: ANALYSIS_ID,
};
