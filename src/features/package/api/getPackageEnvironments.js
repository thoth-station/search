import axios from "axios";
import { THOTH_URL } from "config";
import { useQuery } from "react-query";

export const getPackageEnvironments = async (name, version, index) => {
    return axios.get(THOTH_URL + "/python/package/version/environments", {
        params: {
            name: name,
            version: version,
            index: index,
        },
        headers: {
            accept: "application/json",
        },
    });
};

export const usePackageEnvironments = (name, version, index, config) => {
    return useQuery({
        ...config,
        queryKey: ["packageEnvironments", name, version, index],
        queryFn: () => getPackageEnvironments(name, version, index),
    });
};
