import React from "react";
import { unmountComponentAtNode } from "react-dom";

import { ImageInfo } from "../ImageInfo";
import { findByText, findByTestId } from "@testing-library/react";
import { render_with_overlay } from "tests/test-utils";
import { generateImageDocument, generateImageMetadata } from "tests/generators";

let container = null;
let imageDocument = null;
let imageMetadata = null;

jest.mock("react-router-dom");

beforeAll(() => {
    imageDocument = generateImageDocument()
    imageMetadata = generateImageMetadata()
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
    await render_with_overlay(<ImageInfo/>, container);

    const exists = await findByTestId(container, "image-info-not-loaded");
    expect(exists).toBeTruthy();
});

it("renders with only metadata document", async () => {
    await render_with_overlay(<ImageInfo imageMetadata={imageMetadata} />, container);

    const arch = await findByText(container, imageMetadata.architecture);
    expect(arch).toBeTruthy();

});

it("renders with only image document", async () => {
    await render_with_overlay(<ImageInfo imageDocument={imageDocument}/>, container);

    const arch = await findByText(container, imageMetadata.architecture);
    expect(arch).toBeTruthy();
});


it("renders with both documents", async () => {
    await render_with_overlay(<ImageInfo imageDocument={imageDocument} imageMetadata={imageMetadata}/>, container);

    const arch = await findByText(container, imageMetadata.architecture);
    expect(arch).toBeTruthy();
});
