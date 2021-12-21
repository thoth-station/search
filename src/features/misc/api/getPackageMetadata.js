import axios from "axios";
import { THOTH_URL, PYPI_URL } from "config";
import { useQueries, useQuery } from "react-query";

export const getPackageMetadata = async (
    name,
    version,
    index = "https://pypi.org/simple",
) => {
    return axios.get(THOTH_URL + "/python/package/metadata", {
        params: {
            name: name,
            version: version,
            index: index,
        },
        headers: {
            accept: "application/json",
        },
    });
    // .catch(e => {
    //     if (e?.response?.status === 404 || e?.isAxiosError) {
    //         return getPackageMetadataPyPi(name, version);
    //     } else {
    //         throw e;
    //     }
    // });
};

export const getPackageMetadataPyPi = (name, version) => {
    return axios
        .get(PYPI_URL + "/" + name + (version ? "/" + version : "") + "/json")
        .catch(() => {
            return undefined;
        });
};

export const usePackageMetadata = (name, version, index, config) => {
    return useQuery({
        ...config,
        queryKey: ["packageMetadata", name, version, index],
        queryFn: () => getPackageMetadata(name, version, index),
    });
};

export const usePackagesMetadata = (packages, config) => {
    return useQueries(
        packages.map(p => {
            return {
                ...config,
                queryKey: ["packageMetadata", p.name, p.version],
                queryFn: () => getPackageMetadata(p.name, p.version),
            };
        }),
    );
};
