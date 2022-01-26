import React from "react";
import { unmountComponentAtNode } from "react-dom";

import { PackageDependencies } from "../PackageDependencies";
import { findByText, findByTestId } from "@testing-library/react";
import { Graph } from "utils/Graph";
import { render_with_overlay } from "tests/test-utils";

let container = null;
let graph = new Graph();

jest.mock("react-router-dom");

beforeAll(() => {
    const app = graph.addVertex("*App", {
        id: "*App",
        label: "App",
        depth: -1,
    });
    for (let i = 0; i < 10; i++) {
        const node = graph.addVertex(i, {
            label: `node-${i}`,
            versions: [`v${i}`],
            specifier: `==v${i}`,
            extra: undefined,
        });

        graph.addEdge(app.key, node.key);
    }
});

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it("renders without a graph", async () => {
    await render_with_overlay(<PackageDependencies />, container);

    const exists = await findByTestId(
        container,
        "package-dependencies-not-loaded",
    );
    expect(exists).toBeTruthy();
});

it("renders with a graph", async () => {
    await render_with_overlay(<PackageDependencies graph={graph} />, container);

    const exists = await findByTestId(container, "package-dependencies-loaded");
    expect(exists).toBeTruthy();
});

it("renders correct packages", async () => {
    await render_with_overlay(<PackageDependencies graph={graph} />, container);

    const node_0 = await findByText(container, "node-0");
    expect(node_0).toBeTruthy();

    const node_9 = await findByText(container, "node-9");
    expect(node_9).toBeTruthy();
});
