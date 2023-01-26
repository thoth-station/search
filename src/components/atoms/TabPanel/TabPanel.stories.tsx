import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import TabPanelComponent from ".";

export default {
  title: "atoms/TabPanel",
  component: TabPanelComponent,
} as ComponentMeta<typeof TabPanelComponent>;

const Template: ComponentStory<typeof TabPanelComponent> = args => {
  const [tab, setTab] = React.useState(1);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <button onClick={() => setTab(1)}>Tab 1</button>
        <button onClick={() => setTab(2)}>Tab 2</button>
        <button onClick={() => setTab(3)}>Tab 3</button>
      </div>
      <TabPanelComponent value={args.value ?? tab} index={1}>
        Tab 1
      </TabPanelComponent>
      <TabPanelComponent value={args.value ?? tab} index={2}>
        Tab 2
      </TabPanelComponent>
      <TabPanelComponent value={args.value ?? tab} index={3}>
        Tab 3
      </TabPanelComponent>
    </div>
  );
};

export const TabPanel = Template.bind({});
TabPanel.args = {};
