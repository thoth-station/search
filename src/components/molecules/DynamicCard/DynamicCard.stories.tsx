import { Chip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import DynamicCardComponent from ".";

export default {
  title: "molecules/DynamicCard",
  component: DynamicCardComponent,
  args: {
    url: "#",
    title: "Card Title",
    avatar: <Chip icon={<InfoOutlinedIcon />} label="12" color="info" />,
    subheader: "This is a subheader",
  },
} as ComponentMeta<typeof DynamicCardComponent>;

const Template: ComponentStory<typeof DynamicCardComponent> = args => (
  <DynamicCardComponent {...args}>
    <p>CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT CONTENT</p>
  </DynamicCardComponent>
);

export const DynamicCard = Template.bind({});
DynamicCard.args = {};
