import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import BubbleHistogramComponent from ".";

export default {
  title: "molecules/BubbleHistogram",
  component: BubbleHistogramComponent,
  argTypes: { handleClick: { action: "clicked" } },
  args: {
    source: {
      values: [
        ["a", 1],
        ["b", 2],
        ["c", 3],
        ["d", 2],
        ["e", 1],
        ["f", 2],
        ["g", 3],
        ["h", 4],
        ["i", 5],
      ],
    },
  },
} as ComponentMeta<typeof BubbleHistogramComponent>;

const Template: ComponentStory<typeof BubbleHistogramComponent> = args => <BubbleHistogramComponent {...args} />;

export const BubbleHistogram = Template.bind({});
