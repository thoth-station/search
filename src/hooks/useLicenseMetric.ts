import { useMemo } from "react";
import { useAdviseDocument, usePackagesMetadata } from "api";
import { PackageMetadata } from "lib/types/PackageMetadata";
import { useQuery } from "@tanstack/react-query";

export type LicenseMetricType = {
  /** The license name */
  [key: string]: {
    /** The packages that use this license as an object */
    packages: {
      [key: string]: {
        specific?: string;
      };
    };
    /** License specific information */
    metadata: {
      /** If license is approved by OSI standards */
      isOsiApproved: boolean | null;
    };
  };
};

export const useLicenseMetric = (analysis_id: string) => {
  const { package_list } = useAdviseDocument(analysis_id);
  const packagesMetadata = usePackagesMetadata(package_list);
  const allPackagesMetadataLoaded =
    useMemo(() => packagesMetadata?.every(query => query.isFetched), [packagesMetadata]) ?? false;

  const queryFunction = () => {
    if (!allPackagesMetadataLoaded) {
      throw "not all metadata has been loaded";
    }

    const base: LicenseMetricType = {};

    packagesMetadata.forEach(pkg => {
      const metadata = pkg.data?.data.metadata.importlib_metadata.metadata as PackageMetadata | undefined;

      if (metadata) {
        // license metric
        type PackageLicenses = {
          generalLicense: string;
          specificLicense?: string;
          isOsiApproved: boolean | null;
        }[];
        const packageLicenses: PackageLicenses = [];

        // get general classification
        metadata?.Classifier?.forEach(classifier => {
          const parsed = classifier.split(" :: ");

          if (parsed[0] === "License") {
            if (parsed[1] === "OSI Approved") {
              packageLicenses.push({
                generalLicense: parsed?.[2] ?? metadata?.License,
                specificLicense: metadata?.License,
                isOsiApproved: true,
              });
            } else {
              packageLicenses.push({
                generalLicense: parsed?.[1] ?? metadata?.License,
                specificLicense: metadata?.License,
                isOsiApproved: false,
              });
            }
          }
        });

        if (packageLicenses.length === 0) {
          packageLicenses.push({
            generalLicense: metadata?.License ?? "N/A",
            specificLicense: metadata?.License ?? "N/A",
            isOsiApproved: null,
          });
        }

        // get specific classification
        packageLicenses.forEach(license => {
          const pkgName = pkg.data?.data.metadata.package_name.toLowerCase();
          if (!base[license.generalLicense]) {
            base[license.generalLicense] = {
              packages: {},
              metadata: {
                isOsiApproved: license.isOsiApproved,
              },
            };
          }

          if (pkgName) {
            base[license.generalLicense].packages = {
              ...base[license.generalLicense].packages,
              [pkgName]: {
                specific: license.specificLicense,
              },
            };
          }
        });
      }
    });

    return base;
  };

  const query = useQuery({
    queryKey: ["license_metric", analysis_id],
    enabled: allPackagesMetadataLoaded,
    queryFn: async () => queryFunction(),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    loadingProgress: null,
    loadingText: "Creating license metric",
  };
};
