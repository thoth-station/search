import { render as rtlRender } from "@testing-library/react";
import "core-js/stable";
import { AppProvider } from "providers/app";
import { ReactElement } from "react";

export const render_with_overlay = (component: ReactElement, container: HTMLElement) => {
  return {
    ...rtlRender(component, {
      wrapper: AppProvider,
      container: container,
    }),
  };
};
