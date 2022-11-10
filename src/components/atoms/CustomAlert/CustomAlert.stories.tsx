import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import CustomAlert from ".";

export default {
  title: "atoms/CustomAlert",
  component: CustomAlert,
} as ComponentMeta<typeof CustomAlert>;

const Template: ComponentStory<typeof CustomAlert> = args => <CustomAlert {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  info: {
    message: "This is an info message",
    type: "info",
  },
};

export const Link = Template.bind({});
Link.args = {
  info: {
    message: "This is an error message with a link",
    type: "error",
    link: "#error",
  },
};
