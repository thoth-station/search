import axios from "axios";
import { THOTH_URL, PYPI_URL } from "config";
import { useQueries, useQuery } from "react-query";

export const getPackageMetadata = async (
    name,
    version,
    index,
    os_name,
    os_version,
    python_version,
) => {
    if (
        !name ||
        !version ||
        !index ||
        !os_name ||
        !os_version ||
        !python_version
    ) {
        return;
    }
    return await axios.get(THOTH_URL + "/python/package/version/metadata", {
        params: {
            name: name,
            version: version,
            index: index,
            os_name: os_name,
            os_version: os_version,
            python_version: python_version,
        },
        headers: {
            accept: "application/json",
        },
    });
};

export const getPackageMetadataPyPi = (name, version) => {
    return axios
        .get(PYPI_URL + "/" + name + (version ? "/" + version : "") + "/json")
        .catch(() => {
            return undefined;
        });
};

export const usePackageMetadata = (
    name,
    version,
    index,
    os_name,
    os_version,
    python_version,
    config,
) => {
    return useQuery({
        ...config,
        enabled:
            !!name &&
            !!version &&
            !!index &&
            !!os_name &&
            !!os_version &&
            !!python_version,
        queryKey: [
            "packageMetadata",
            name,
            version,
            index,
            os_name,
            os_version,
            python_version,
        ],
        queryFn: () =>
            getPackageMetadata(
                name,
                version,
                index,
                os_name,
                os_version,
                python_version,
            ),
    });
};

export const usePackagesMetadata = (packages, config) => {
    return useQueries(
        packages.map(p => {
            return {
                ...config,
                enabled:
                    !!p.name &&
                    !!p.version &&
                    !!p.index &&
                    !!p.os_name &&
                    !!p.os_version &&
                    !!p.python_version,
                queryKey: [
                    "packageMetadata",
                    p.name,
                    p.version,
                    p.index,
                    p.os_name,
                    p.os_version,
                    p.python_version,
                ],
                queryFn: () =>
                    getPackageMetadata(
                        p.name,
                        p.version,
                        p.index,
                        p.os_name,
                        p.os_version,
                        p.python_version,
                    ),
            };
        }),
    );
};
