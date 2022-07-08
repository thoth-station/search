import React from "react";
import { unmountComponentAtNode } from "react-dom";

import { PackageDependencies } from "../PackageDependencies";
import { findByText, findByTestId } from "@testing-library/react";
import { Graph } from "lib/interfaces/Graph";
import { render_with_overlay } from "tests/test-utils";
import { Node } from "../../../../../lib/interfaces/Node";
import { SimplePackageNodeValue } from "../../../../../lib/interfaces/SimplePackageNodeValue";

let container: HTMLElement;
const graph: Graph<Node<SimplePackageNodeValue>> = new Graph();

jest.mock("react-router-dom");

beforeAll(() => {
  const app = graph.addVertex(
    "*App",
    {
      id: "*App",
      label: "App",
      depth: -1,
    },
    Node,
  );
  for (let i = 0; i < 10; i++) {
    const node = graph.addVertex(
      i.toString(),
      {
        label: `node-${i}`,
        id: i.toString(),
        depth: 0,
        versions: [`v${i}`],
        specifier: `==v${i}`,
        extra: undefined,
      },
      Node,
    );

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
});

it("renders without a graph", async () => {
  render_with_overlay(<PackageDependencies />, container);

  const exists = await findByTestId(container, "package-dependencies-not-loaded");
  expect(exists).toBeTruthy();
});

it("renders with a graph", async () => {
  render_with_overlay(<PackageDependencies graph={graph} />, container);

  const exists = await findByTestId(container, "package-dependencies-loaded");
  expect(exists).toBeTruthy();
});

it("renders correct packages", async () => {
  render_with_overlay(<PackageDependencies graph={graph} />, container);

  const node_0 = await findByText(container, "node-0");
  expect(node_0).toBeTruthy();

  const node_9 = await findByText(container, "node-9");
  expect(node_9).toBeTruthy();
});
