import React from "react";
import axios from "axios";
import { unmountComponentAtNode } from "react-dom";

import { render_with_overlay } from "tests/test-utils";
import { ImageRoutes } from "../index";

import { useParams, useLocation, useNavigate } from "react-router-dom";
import { findByTestId } from "@testing-library/react";

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
