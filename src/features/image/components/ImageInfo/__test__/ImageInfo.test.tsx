import React from "react";
import { unmountComponentAtNode } from "react-dom";

import { ImageInfo } from "../ImageInfo";
import { findByText, findByTestId } from "@testing-library/react";
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
    if (container) {
        unmountComponentAtNode(container);
        container.remove();
    }
});

it("renders without any documents", async () => {
    render_with_overlay(<ImageInfo />, container);

    const exists = await findByTestId(container, "image-info-not-loaded");
    expect(exists).toBeTruthy();
});

it("renders with only image document", async () => {
    render_with_overlay(<ImageInfo imageDocument={imageDocument} />, container);

    const arch = await findByText(
        container,
        imageDocument.result["skopeo-inspect"].Architecture,
    );
    expect(arch).toBeTruthy();
});
