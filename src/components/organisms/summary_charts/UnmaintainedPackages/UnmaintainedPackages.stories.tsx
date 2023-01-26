import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { ANALYSIS_ID } from "tests/defaults";

import UnmaintainedPackagesComponent from ".";

export default {
  title: "organisms/Summary Charts/UnmaintainedPackages",
  component: UnmaintainedPackagesComponent,
} as ComponentMeta<typeof UnmaintainedPackagesComponent>;

const Template: ComponentStory<typeof UnmaintainedPackagesComponent> = args => (
  <UnmaintainedPackagesComponent {...args} />
);

export const UnmaintainedPackages = Template.bind({});
UnmaintainedPackages.args = {
  analysis_id: ANALYSIS_ID,
};
