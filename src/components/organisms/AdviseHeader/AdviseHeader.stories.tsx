import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";
import { ANALYSIS_ID } from "tests/defaults";
import AdviseHeaderComponent from ".";

export default {
  title: "organisms/AdviseHeader",
  component: AdviseHeaderComponent,
} as ComponentMeta<typeof AdviseHeaderComponent>;

const Template: ComponentStory<typeof AdviseHeaderComponent> = args => <AdviseHeaderComponent {...args} />;

export const AdviseHeader = Template.bind({});
AdviseHeader.args = {
  analysis_id: ANALYSIS_ID,
};
