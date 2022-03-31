import React from "react";
import { unmountComponentAtNode } from "react-dom";

import { RPMInfo } from "../RPMInfo";
import { findByTestId } from "@testing-library/react";
import { render_with_overlay } from "tests/test-utils";
import { generateImageDocument } from "tests/generators";
import { ImageDocumentRequestResponseSuccess } from "../../../api";

let container: HTMLElement;
let imageDocument: ImageDocumentRequestResponseSuccess;

jest.mock("react-router-dom");

beforeAll(() => {
    imageDocument = generateImageDocument();
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

it("renders without any documents", async () => {
    render_with_overlay(<RPMInfo />, container);

    const exists = await findByTestId(container, "rpm-info-not-loaded");
    expect(exists).toBeTruthy();
});

it("renders with the document", async () => {
    render_with_overlay(<RPMInfo imageDocument={imageDocument} />, container);

    const exists = await findByTestId(container, "rpm-info-loaded");
    expect(exists).toBeTruthy();
});
