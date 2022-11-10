import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import JavascriptObject from ".";

export default {
  title: "atoms/JavascriptObject",
  component: JavascriptObject,
} as ComponentMeta<typeof JavascriptObject>;

const Template: ComponentStory<typeof JavascriptObject> = args => <JavascriptObject {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  obj: {
    a: 1,
    b: [1, 2, 3],
    c: {
      ca: false,
      cb: true,
      cc: null,
    },
    d: undefined,
  },
};

export const String = Template.bind({});
String.args = {
  obj: "Lorem ipsum",
};
