import { ComponentMeta, ComponentStory } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";

import { expect } from "@storybook/jest";
import * as React from "react";

import GenericTable from ".";

export default {
  title: "organisms/GenericTable",
  component: GenericTable,
  args: {
    headers: [
      { id: "column1", label: "Column 1" },
      { id: "column2", label: "Column 2" },
      { id: "column3", label: "Column 3" },
    ],
  },
} as ComponentMeta<typeof GenericTable>;

const Template: ComponentStory<typeof GenericTable> = args => <GenericTable {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  rows: [
    { column1: "a", column2: 2, column3: "20 lb" },
    { column1: "b", column2: 3, column3: "10 lb" },
    { column1: "c", column2: 1, column3: "30 lb" },
    { column1: null, column2: 100, column3: "40 lb" },
  ],
};

Primary.play = async ({ args, canvasElement }) => {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getAllByTestId("column-header-label")[0]);

  const cells = canvas.getAllByTestId("table-cell");
  expect(cells[0].innerText === "c" && cells[1].innerText === "1" && cells[2].innerText === "30 lb").toBe(true);

  const actionButton = canvas.getAllByTestId("action-button")[0];
  userEvent.click(actionButton);
  expect(args.onAction).toHaveBeenCalled();
};

export const Long = Template.bind({});
Long.args = {
  rows: [...Array(100).keys()].map(i => ({ column1: i, column2: i * 2, column3: i * i })),
};

export const Empty = Template.bind({});
Empty.args = {};

Empty.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  expect(canvas.getByTestId("loading-spinner")).toBeTruthy;
};
