import React from "react";
import axios from "axios";
import { unmountComponentAtNode } from "react-dom";

import { render_with_overlay } from "tests/test-utils";
import { ImageRoutes } from "../index";

import { useParams, useLocation, useNavigate } from "react-router-dom";
import { findByTestId, waitFor } from "@testing-library/react";
import { generateImageMetadata } from "tests/generators";

let container: HTMLElement;

jest.mock("react-router-dom");
jest.mock("axios");

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);

    (useLocation as jest.Mock).mockClear();
    (useParams as jest.Mock).mockClear();
    (useNavigate as jest.Mock).mockClear();
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();

    jest.restoreAllMocks();
});

it("renders not found page when all api calls reject", async () => {
    (useParams as jest.Mock).mockReturnValue({
        analysis_id: "package-extract-test",
    });

    (useLocation as jest.Mock).mockReturnValue({
        state: {},
    });

    // mock error for all calls
    (axios.get as jest.Mock).mockRejectedValue({});
    (axios.post as jest.Mock).mockRejectedValue({});

    render_with_overlay(<ImageRoutes />, container);

    const exists = await findByTestId(container, "image-not-loaded");
    expect(exists).toBeTruthy();
});

it("renders not found even if metadata is found", async () => {
    (useParams as jest.Mock).mockReturnValue({
        analysis_id: "package-extract-test",
    });

    (useLocation as jest.Mock).mockReturnValue({
        state: { image_name: "image/location" },
    });

    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    // mock error for all calls
    (axios.get as jest.Mock).mockRejectedValue("Axios get request error");

    // mock 200
    (axios.post as jest.Mock).mockResolvedValue({
        data: generateImageMetadata(),
    });

    render_with_overlay(<ImageRoutes />, container);

    await waitFor(() => expect(navigate).toHaveBeenCalled());
});

it("renders content even if document is still in progress", async () => {
    (useParams as jest.Mock).mockReturnValue({
        analysis_id: "package-extract-test",
    });

    (useLocation as jest.Mock).mockReturnValue({
        state: { image_name: "image/location" },
    });

    (axios.post as jest.Mock).mockResolvedValue({
        data: generateImageMetadata(),
    });

    (axios.get as jest.Mock).mockResolvedValueOnce({
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
