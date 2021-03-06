// React
import React, { useEffect, useMemo, useState } from "react";

// local
import { PackageDependencies, PackageHeader } from "../components";

// material-ui
import { CircularProgress, Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { usePackageMetadata } from "api";
import { PackageNotFound } from "./PackageNotFound";
import { useSimpleGraph } from "../hooks";
import { usePackageEnvironments, usePackageVersions } from "../api";
import { ErrorPage } from "routes/ErrorPage";
import { PackageMetadata } from "lib/types/PackageMetadata";

type SpecDetails = {
  package_name: string;
  package_version?: string;
  index_url?: string;
  os_name?: string;
  os_version?: string;
  python_version?: string;
};

export const SpecContext = React.createContext<{
  specs: SpecDetails;
  defaultSpecs: SpecDetails;
}>({ specs: { package_name: "" }, defaultSpecs: { package_name: "" } });

// The page that displays all analysis data
export const PackageOverview = () => {
  const params = useParams<SpecDetails>();
  const [defaultSpecs, setDefaultSpecs] = useState<SpecDetails>({
    package_name: params.package_name ?? "",
    package_version: undefined,
    index_url: undefined,
    os_name: undefined,
    os_version: undefined,
    python_version: undefined,
  });

  // what is on the url params
  const specs = useMemo<SpecDetails>(() => {
    return {
      package_name: params.package_name ?? "",
      package_version: params?.package_version,
      index_url: params?.index_url ? decodeURIComponent(params.index_url) : undefined,
      os_name: params?.os_name,
      os_version: params?.os_version,
      python_version: params?.python_version,
    };
  }, [params]);

  // get all pages of versions/indexes and merge them together
  const allVersions = usePackageVersions(specs.package_name);

  // get environments for specific package, version, index
  const allEnvironments = usePackageEnvironments(
    specs.package_name,
    specs.package_version ?? defaultSpecs.package_version,
    specs.index_url ?? defaultSpecs.index_url,
    { useErrorBoundary: false },
  );

  // some params are optional but still need a default value
  useEffect(() => {
    const d: SpecDetails = {
      package_name: params.package_name ?? "",
      package_version: undefined,
      index_url: undefined,
      os_name: undefined,
      os_version: undefined,
      python_version: undefined,
    };

    // get default package version and index
    // needs package name and versions list
    if (specs.package_name) {
      if (allVersions.data?.data && allVersions.data.data.versions.length > 0) {
        d.package_version = allVersions.data.data.versions.at(-1)?.package_version;
        d.index_url = allVersions.data.data.versions.at(-1)?.index_url;
      }
    }

    // get default environment
    // needs list of environments
    if (allEnvironments.data && allEnvironments.data.data.environments.length > 0) {
      const filtered = allEnvironments.data.data.environments.filter(
        env =>
          (!specs.os_name || specs.os_name === env.os_name) &&
          (!specs.os_version || specs.os_version === env.os_version),
      );
      if (filtered.length > 0) {
        d.os_name = filtered.at(0)?.os_name;
        d.os_version = filtered.at(0)?.os_version;
        d.python_version = filtered.at(0)?.python_version;
      }
    }

    if (Object.entries(defaultSpecs).some(([key, val]) => d[key as keyof typeof d] !== val)) {
      setDefaultSpecs(d);
    }
  }, [allVersions.data, allEnvironments, specs]);

  // get package metadata
  const metadata = usePackageMetadata(
    specs.package_name,
    specs.package_version ?? defaultSpecs.package_version,
    specs.index_url ?? defaultSpecs.index_url,
    specs.os_name ?? defaultSpecs.os_name,
    specs.os_version ?? defaultSpecs.os_version,
    specs.python_version ?? defaultSpecs.python_version,
    { useErrorBoundary: false },
  );

  const graph = useSimpleGraph(metadata);

  if (metadata.isLoading || allVersions?.data?.data?.versions?.length === 0) {
    return (
      <div className="w-full h-48 flex justify-center items-center" data-testid="loading">
        <CircularProgress />
      </div>
    );
  }

  if (!metadata.data) {
    if (metadata?.error?.response?.data?.error) {
      return (
        <ErrorPage
          message={metadata.error.response.data.error}
          type={metadata.error.response.status}
          reason={`${metadata?.error?.config?.url} failed with params ${JSON.stringify(
            metadata?.error?.config?.params,
          )}`}
        />
      );
    }
    return <PackageNotFound package_name={params.package_name ?? ""} package_version={params.package_version ?? ""} />;
  }

  return (
    <SpecContext.Provider value={{ specs, defaultSpecs }}>
      <Grid container>
        <Grid item xs={12} mb={3}>
          <PackageHeader
            metadata={metadata.data.data.metadata.importlib_metadata.metadata as PackageMetadata}
            allVersions={allVersions?.data?.data?.versions}
            allEnvironments={allEnvironments?.data?.data?.environments}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PackageDependencies graph={graph} />
        </Grid>
      </Grid>
    </SpecContext.Provider>
  );
};
