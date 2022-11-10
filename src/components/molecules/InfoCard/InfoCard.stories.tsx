import { Button, Typography } from "@mui/material";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import InfoCard from ".";

export default {
  title: "molecules/InfoCard",
  component: InfoCard,
  args: {
    cardMeta: { title: "Card Title", subTitle: "Lorem ipsum dolor sit amet" },
  },
} as ComponentMeta<typeof InfoCard>;

const Template: ComponentStory<typeof InfoCard> = args => <InfoCard {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  cardBody: (
    <Typography variant="body2">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Typography>
  ),
};

export const Action = Template.bind({});
Action.args = {
  ...Primary.args,
  cardAction: <Button>Action Button</Button>,
};
