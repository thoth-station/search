import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { ANALYSIS_ID } from "tests/defaults";

import SelectedPackageComponent from ".";

export default {
  title: "organisms/SelectedPackage",
  component: SelectedPackageComponent,
} as ComponentMeta<typeof SelectedPackageComponent>;

const Template: ComponentStory<typeof SelectedPackageComponent> = args => <SelectedPackageComponent {...args} />;

export const SelectedPackage = Template.bind({});
SelectedPackage.args = {
  analysis_id: ANALYSIS_ID,
  selectedPackage: "numpy",
};
