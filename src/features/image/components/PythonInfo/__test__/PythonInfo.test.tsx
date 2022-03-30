import React from "react";
import { unmountComponentAtNode } from "react-dom";

import { PythonInfo } from "../PythonInfo";
import { findAllByText, findByTestId } from "@testing-library/react";
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
    render_with_overlay(<PythonInfo />, container);

    const exists = await findByTestId(container, "python-info-not-loaded");
    expect(exists).toBeTruthy();
});

it("renders with the document", async () => {
    render_with_overlay(
        <PythonInfo imageDocument={imageDocument} />,
        container,
    );

    const exists = await findByTestId(container, "python-info-loaded");
    expect(exists).toBeTruthy();
});

it("renders correct number of Python files", async () => {
    render_with_overlay(
        <PythonInfo imageDocument={imageDocument} />,
        container,
    );

    const exists = await findAllByText(
        container,
        imageDocument.result["python-files"].length,
    );
    expect(exists).toBeTruthy();
});
