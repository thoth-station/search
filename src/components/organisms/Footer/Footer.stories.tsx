import { ComponentMeta, ComponentStory } from "@storybook/react";
import * as React from "react";

import FooterComponent from ".";

export default {
  title: "organisms/Footer",
  component: FooterComponent,
} as ComponentMeta<typeof FooterComponent>;

const Template: ComponentStory<typeof FooterComponent> = () => <FooterComponent />;

export const Footer = Template.bind({});
