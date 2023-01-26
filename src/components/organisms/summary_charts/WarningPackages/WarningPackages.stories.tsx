import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { ANALYSIS_ID } from "tests/defaults";

import WarningPackagesComponent from ".";

export default {
  title: "organisms/Summary Charts/WarningPackages",
  component: WarningPackagesComponent,
} as ComponentMeta<typeof WarningPackagesComponent>;

const Template: ComponentStory<typeof WarningPackagesComponent> = args => <WarningPackagesComponent {...args} />;

export const WarningPackages = Template.bind({});
WarningPackages.args = {
  analysis_id: ANALYSIS_ID,
};
