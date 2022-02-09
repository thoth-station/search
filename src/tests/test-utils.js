import { render as rtlRender } from "@testing-library/react";
import "core-js/stable";
import { AppProvider } from "providers/app";

export const render_with_overlay = (component, container) => {
    return {
        ...rtlRender(component, {
            wrapper: AppProvider,
            container: container,
        }),
    };
};
