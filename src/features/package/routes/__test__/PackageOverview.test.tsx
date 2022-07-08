import React from "react";
import { unmountComponentAtNode } from "react-dom";

import { render_with_overlay } from "tests/test-utils";
import { PackageOverview } from "../PackageOverview";
import { useSimpleGraph } from "../../hooks";
import { usePackageEnvironments, usePackageVersions } from "../../api";
import { useParams } from "react-router-dom";
import { waitFor } from "@testing-library/react";
import { usePackageMetadata } from "api";

let container: HTMLElement;

jest.mock("react-router-dom");

jest.mock("../../api/getPackageVersions");

jest.mock("../../hooks/useSimpleGraph");

jest.mock("../../api/getPackageEnvironments");

jest.mock("../../../../api/getPackageMetadata");

beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);

  (useParams as jest.Mock).mockClear();

  (useSimpleGraph as jest.Mock).mockReturnValue(undefined);
  (usePackageVersions as jest.Mock).mockReturnValue({
    data: {
      data: {
        versions: [
          {
            package_name: "fallback",
            package_version: "fallback",
            index_url: "fallback",
          },
        ],
      },
    },
  });
  (usePackageEnvironments as jest.Mock).mockReturnValue({
    data: {
      data: {
        environments: [
          {
            os_name: "fallback",
            os_version: "fallback",
            python_version: "fallback",
          },
        ],
      },
    },
  });
  (usePackageMetadata as jest.Mock).mockReturnValue({
    data: {},
    isLoading: () => true,
  });
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();

  jest.restoreAllMocks();
});

it("uses url params first", async () => {
  (useParams as jest.Mock).mockReturnValue({
    package_name: "package-name",
    package_version: "package-version",
    index_url: "index-url",
    os_name: "os-name",
    os_version: "os-version",
    python_version: "python-version",
  });

  render_with_overlay(<PackageOverview />, container);
  expect(usePackageMetadata).toHaveBeenCalledWith(
    "package-name",
    "package-version",
    "index-url",
    "os-name",
    "os-version",
    "python-version",
    { useErrorBoundary: false },
  );
});

it("uses defaults when only given package name", async () => {
  (useParams as jest.Mock).mockReturnValue({
    package_name: "package-name",
  });

  render_with_overlay(<PackageOverview />, container);

  await waitFor(() => expect(usePackageMetadata).toHaveBeenCalledTimes(2));

  expect(usePackageMetadata).toHaveBeenCalledWith(
    "package-name",
    "fallback",
    "fallback",
    "fallback",
    "fallback",
    "fallback",
    { useErrorBoundary: false },
  );
});

it("calls metadata endpoint with undefined inputs", async () => {
  (useParams as jest.Mock).mockReturnValue({
    package_name: "package-name",
  });

  (usePackageVersions as jest.Mock).mockReturnValue({});
  (usePackageEnvironments as jest.Mock).mockReturnValue({});

  render_with_overlay(<PackageOverview />, container);

  await waitFor(() => expect(usePackageMetadata).toHaveBeenCalledTimes(1));

  expect(usePackageMetadata).toHaveBeenCalledWith(
    "package-name",
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    { useErrorBoundary: false },
  );
});
