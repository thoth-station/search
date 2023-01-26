import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import TimelineChartComponent from ".";

export default {
  title: "molecules/TimelineChart",
  component: TimelineChartComponent,
  args: {
    source: [
      ["A", "1634661019"],
      ["B", "1660928134"],
      ["C", "1658249734"],
    ],
    selected: "A",
  },
} as ComponentMeta<typeof TimelineChartComponent>;

const Template: ComponentStory<typeof TimelineChartComponent> = args => <TimelineChartComponent {...args} />;

export const TimelineChart = Template.bind({});
