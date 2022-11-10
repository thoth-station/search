import { HowToVoteRounded } from "@mui/icons-material";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import React, { useState } from "react";

import PieChartComponent from ".";

export default {
  title: "molecules/PieChart",
  component: PieChartComponent,
  args: {
    source: [
      {
        label: "A",
        angle: 10,
      },
      {
        label: "B",
        angle: 20,
      },
    ],
  },
} as ComponentMeta<typeof PieChartComponent>;

const Template: ComponentStory<typeof PieChartComponent> = args => {
  const [hovered, setHovered] = useState<{ label: string } | undefined>();
  return <PieChartComponent {...args} hovered={hovered} setHovered={setHovered} />;
};

export const PieChart = Template.bind({});
