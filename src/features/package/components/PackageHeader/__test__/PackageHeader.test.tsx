import { unmountComponentAtNode } from "react-dom";
import React from "react";

import { IPackageHeader, PackageHeader } from "../PackageHeader";
import { SpecContext } from "../../../routes/PackageOverview";
import { queryByTestId, waitFor, findByText, fireEvent, getByTestId } from "@testing-library/react";
import { render_with_overlay } from "tests/test-utils";

let container: HTMLElement;
let metadata: IPackageHeader["metadata"];
let allVersions: IPackageHeader["allVersions"];
let allEnvironments: IPackageHeader["allEnvironments"];

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

beforeAll(() => {
  metadata = {
    Name: "name-test",
    Summary: "summary-test",
    License: "license-test",
  };

  allVersions = [
    {
      package_name: "package",
      package_version: "1.2.3",
      index_url: "test",
    },
  ];

  allEnvironments = [
    {
      os_name: "test",
      os_version: "3.4.5",
      python_version: "test",
    },
  ];
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
  // container = null;
});

it("renders without metadata", async () => {
  render_with_overlay(<PackageHeader />, container);
  await waitFor(() => expect(queryByTestId(container, /package-header-not-loaded/i)).toBeTruthy());
});

it("renders with only metadata", async () => {
  render_with_overlay(
    <SpecContext.Provider
      value={{
        specs: {
          package_name: "test",
        },
        defaultSpecs: {
          package_name: "test",
        },
      }}
    >
      <PackageHeader metadata={metadata} />
    </SpecContext.Provider>,

    container,
  );
  const exists_name = await findByText(container, "name-test");
  expect(exists_name).toBeTruthy();

  const exists_summary = await findByText(container, "summary-test");
  expect(exists_summary).toBeTruthy();

  const exists_license = await findByText(container, "license-test");
  expect(exists_license).toBeTruthy();
});

it("renders with all params", async () => {
  render_with_overlay(
    <SpecContext.Provider
      value={{
        specs: {
          package_name: "test",
          package_version: "1.2.3",
          index_url: "test",
          os_name: "test",
          os_version: "3.4.5",
          python_version: "test",
        },
        defaultSpecs: {
          package_name: "test",
        },
      }}
    >
      <PackageHeader metadata={metadata} allVersions={allVersions} allEnvironments={allEnvironments} />
    </SpecContext.Provider>,

    container,
  );

  const before_click = await findByText(container, "1.2.3");
  expect(before_click).toBeTruthy();

  fireEvent(
    getByTestId(container, "package-header-expand-button"),
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    }),
  );

  const after_click = await findByText(container, "3.4.5");
  expect(after_click).toBeTruthy();
});
