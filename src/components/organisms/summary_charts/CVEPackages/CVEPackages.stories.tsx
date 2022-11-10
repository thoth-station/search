import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { ANALYSIS_ID } from "tests/defaults";

import CVEPackagesComponent from ".";

export default {
  title: "organisms/Summary Charts/CVEPackages",
  component: CVEPackagesComponent,
} as ComponentMeta<typeof CVEPackagesComponent>;

const Template: ComponentStory<typeof CVEPackagesComponent> = args => <CVEPackagesComponent {...args} />;

export const CVEPackages = Template.bind({});
CVEPackages.args = {
  analysis_id: ANALYSIS_ID,
};
