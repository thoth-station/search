import React from "react";
import InfoCard from "components/Elements/InfoCard";
import { DependenciesMetric, LicenseMetric } from "components/Metrics";
import { Masonry } from "@mui/lab";
import { DebInfo, PythonInfo, ImageInfo, RPMInfo } from "../components";
import { ImageDocumentRequestResponseSuccess } from "../api";
import { ImageMetrics } from "../hooks";

interface IImageSummary {
    imageDocument: ImageDocumentRequestResponseSuccess;
    metrics: ImageMetrics;
}

export const ImageSummary = ({ metrics, imageDocument }: IImageSummary) => {
    return (
        <Masonry columns={{ xs: 1, md: 2 }} spacing={3} sx={{ mb: 3, mt: 1 }}>
            {imageDocument ? (
                <div>
                    <InfoCard
                        cardMeta={{
                            title: "Image Details",
                        }}
                        cardBody={<ImageInfo imageDocument={imageDocument} />}
                    />
                </div>
            ) : undefined}

            {imageDocument?.result?.["python-interpreters"]?.length > 0 ? (
                <div>
                    <InfoCard
                        cardMeta={{
                            title: "Python Details",
                        }}
                        cardBody={<PythonInfo imageDocument={imageDocument} />}
                    />
                </div>
            ) : undefined}

            {imageDocument?.result?.["rpm-dependencies"]?.length > 0 ? (
                <div>
                    <InfoCard
                        cardMeta={{
                            title: "RPM Details",
                        }}
                        cardBody={<RPMInfo imageDocument={imageDocument} />}
                    />
                </div>
            ) : undefined}

            {imageDocument.result?.deb?.length > 0 ? (
                <div>
                    <InfoCard
                        cardMeta={{
                            title: "Debian Details",
                        }}
                        cardBody={<DebInfo imageDocument={imageDocument} />}
                    />{" "}
                </div>
            ) : undefined}

            {Object.keys(metrics?.dependencies?.all ?? {}).length !== 0 ? (
                <div>
                    <InfoCard
                        cardMeta={{
                            title: "Python Packages Dependencies",
                        }}
                        cardBody={
                            <DependenciesMetric
                                metric={metrics?.dependencies}
                            />
                        }
                    />
                </div>
            ) : undefined}

            {Object.keys(metrics?.licenses ?? {}).length !== 0 ? (
                <div>
                    <InfoCard
                        cardMeta={{
                            title: "Python Packages Licenses",
                        }}
                        cardBody={<LicenseMetric metric={metrics?.licenses} />}
                    />{" "}
                </div>
            ) : undefined}
        </Masonry>
    );
};
