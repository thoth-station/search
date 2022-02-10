import React from "react";
import axios from "axios";
import { unmountComponentAtNode } from "react-dom";

import { render_with_overlay } from "tests/test-utils";
import { ImageRoutes } from "../index";

import { useParams, useLocation } from "react-router-dom";
import { findByTestId } from "@testing-library/react";
import { generateImageMetadata } from "tests/generators";

let container = null;

jest.mock("react-router-dom");
jest.mock("axios");

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);

    useLocation.mockClear();
    useParams.mockClear();
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;

    jest.restoreAllMocks();
});

it("renders not found page when all api calls reject", async () => {
    useParams.mockReturnValue({
        analysis_id: "package-extract-test",
    });

    useLocation.mockReturnValue({
        state: {},
    });

    // mock error for all calls
    axios.get.mockRejectedValue();
    axios.post.mockRejectedValue();

    render_with_overlay(<ImageRoutes />, container);

    const exists = await findByTestId(container, "image-not-loaded");
    expect(exists).toBeTruthy();
});

it("renders not found even if metadata is found", async () => {
    useParams.mockReturnValue({
        analysis_id: "package-extract-test",
    });

    useLocation.mockReturnValue({
        state: { image_name: "image/location" },
    });

    // mock error for all calls
    axios.get.mockRejectedValue();

    // mock 200
    axios.post.mockResolvedValue({ data: generateImageMetadata() });

    // mock 200
    //useImageMetadata.mockReturnValue({data: generateImageMetadata()})

    render_with_overlay(<ImageRoutes />, container);

    const exists = await findByTestId(container, "image-not-loaded");
    expect(exists).toBeTruthy();
});

it("renders content even if document is still in progress", async () => {
    useParams.mockReturnValue({
        analysis_id: "package-extract-test",
    });

    useLocation.mockReturnValue({
        state: { image_name: "image/location" },
    });

    axios.post.mockResolvedValue({ data: generateImageMetadata() });

    axios.get.mockResolvedValueOnce({
        data: {
            parameters: {},
            status: {
                finished_at: "2022-01-10T20:46:39+00:00",
                reason: "success",
                started_at: "2022-01-10T20:46:39+00:00",
                state: "success",
            },
        },
    });

    render_with_overlay(<ImageRoutes />, container);

    const exists = await findByTestId(container, "image-loaded");
    expect(exists).toBeTruthy();
});
