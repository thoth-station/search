import { ComponentStory, ComponentMeta } from "@storybook/react";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import React from "react";
import IconText from ".";

export default {
  title: "molecules/IconText",
  component: IconText,
  args: {
    text: "License",
    icon: <GavelRoundedIcon />,
  },
} as ComponentMeta<typeof IconText>;

const Template: ComponentStory<typeof IconText> = args => <IconText {...args} />;

export const Primary = Template.bind({});

export const Link = Template.bind({});
Link.args = {
  link: "#example-link",
};

export const Styled = Template.bind({});
Styled.args = {
  gap: 3,
  color: "blue",
};
