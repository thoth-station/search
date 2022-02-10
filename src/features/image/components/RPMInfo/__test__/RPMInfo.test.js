import React from "react";
import { unmountComponentAtNode } from "react-dom";

import { RPMInfo } from "../RPMInfo";
import { findByTestId } from "@testing-library/react";
import { render_with_overlay } from "tests/test-utils";
import { generateImageDocument } from "tests/generators";

let container = null;
let imageDocument = null;

jest.mock("react-router-dom");

beforeAll(() => {
    imageDocument = generateImageDocument()
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

it("renders without any documents", async () => {
    await render_with_overlay(<RPMInfo/>, container);

    const exists = await findByTestId(container, "rpm-info-not-loaded");
    expect(exists).toBeTruthy();
});

it("renders with the document", async () => {
    await render_with_overlay(<RPMInfo imageDocument={imageDocument}/>, container);

    const exists = await findByTestId(container, "rpm-info-loaded");
    expect(exists).toBeTruthy();
});