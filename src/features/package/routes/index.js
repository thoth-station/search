// React
import React  from "react";
import {Route, Routes, useParams} from "react-router-dom";

// material-ui
import {CircularProgress} from "@material-ui/core";

//api
import {usePackageMetadata} from "features/misc/api";
import {PackageOverview} from "./PackageOverview";
import {NotFound} from "features/misc";
import {PackageNotFound} from "./PackageNotFound";


// The page that displays all analysis data
export const PackageRoutes = () => {
    const params = useParams();
    const metadata = usePackageMetadata(params.package_name, params["*"])

    if (metadata.isLoading) {
        return (
            <div className="w-full h-48 flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    }

    if(!metadata.data) {
        return (
            <PackageNotFound package_name={params.package_name} package_version={params["*"]} />
        )
    }

    return (
        <Routes>
            <Route path="/:package_version" element={<PackageOverview metadata={metadata.data.data.metadata ?? metadata.data.data.info}/>} />
            <Route path="/" element={<PackageOverview metadata={metadata.data.data.metadata ?? metadata.data.data.info}/>} />
            <Route path="*" status={404} element={<NotFound/>} />
        </Routes>
    );
};