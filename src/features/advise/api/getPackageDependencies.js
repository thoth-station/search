import axios from "axios";
import {THOTH_URL} from "config"
import {useQueries, useQuery} from 'react-query';


export const getPackageDependencies = (
    name,
    version,
    index = "https://pypi.org/simple"
) => {
    return axios
        .get(THOTH_URL + "/python/package/dependencies", {
            params: {
                name: name,
                version: version,
                index: index
            },
            headers: {
                accept: "application/json"
            }
        })
};

export const usePackageDependencies = (name, version, config) => {
    return useQuery({
        ...config,
        queryKey: ['packageDependencies', name, version],
        queryFn: () => getPackageDependencies(name, version),
    });
};

export const usePackagesDependencies = (packages, config) => {
    return useQueries(packages.map(p => {
        return {
            ...config,
            queryKey: ['packageDependencies', p.name, p.version],
            queryFn: () => getPackageDependencies(p.name, p.version),
        }
    }))
};