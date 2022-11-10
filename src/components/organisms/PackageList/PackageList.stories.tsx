import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { ANALYSIS_ID } from "tests/defaults";

import PackageListComponent from ".";

export default {
  title: "organisms/PackageList",
  component: PackageListComponent,
} as ComponentMeta<typeof PackageListComponent>;

const Template: ComponentStory<typeof PackageListComponent> = args => <PackageListComponent {...args} />;

export const PackageList = Template.bind({});
PackageList.args = {
  analysis_id: ANALYSIS_ID,
  selected_package: "numpy",
};
