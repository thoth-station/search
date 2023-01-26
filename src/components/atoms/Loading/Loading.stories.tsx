import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import Loading from ".";

export default {
  title: "atoms/Loading",
  component: Loading,
} as ComponentMeta<typeof Loading>;

const Template: ComponentStory<typeof Loading> = args => <Loading {...args} />;

export const Primary = Template.bind({});

export const Text = Template.bind({});
Text.args = {
  isLoading: true,
  loadingLabel: "Loading",
};

export const Progress = Template.bind({});
Progress.args = {
  isLoading: true,
  loadingLabel: "Loading Progress",
  progress: 75,
};

export const Error = Template.bind({});
Error.args = {
  errorTitle: "Error Title",
  errorSubtitle: "An error occurred loading the data",
  isError: true,
};
