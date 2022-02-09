import React from "react";
import { unmountComponentAtNode } from "react-dom";

import { render_with_overlay } from "tests/test-utils";
import { PackageOverview } from "../PackageOverview";
import { useAllVersions, useSimpleGraph } from "../../hooks";
import { usePackageEnvironments } from "../../api";
import { usePackageMetadata } from "../../../misc/api";
import { useParams } from "react-router-dom";
import { waitFor } from "@testing-library/react";

let container = null;

jest.mock("react-router-dom");

jest.mock("../../hooks/useAllVersions");

jest.mock("../../hooks/useSimpleGraph");

jest.mock("../../api/getPackageEnvironments");

jest.mock("../../../misc/api/getPackageMetadata");

beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);

    useParams.mockClear();

    useSimpleGraph.mockReturnValue();
    useAllVersions.mockReturnValue([
        {
            package_version: "fallback",
            index_url: "fallback",
        },
    ]);
    usePackageEnvironments.mockReturnValue({
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
    usePackageMetadata.mockReturnValue({ data: {}, isLoading: () => true });
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;

    jest.restoreAllMocks();
});

it("uses url params first", async () => {
    useParams.mockReturnValue({
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
    useParams.mockReturnValue({
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
    useParams.mockReturnValue({
        package_name: "package-name",
    });

    useAllVersions.mockReturnValue([]);
    usePackageEnvironments.mockReturnValue({});

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
