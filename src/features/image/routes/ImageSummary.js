import React from "react";
import InfoCard from "components/Elements/InfoCard";
import { DependenciesMetric, LicenseMetric } from "components/Metrics";
import PropTypes from "prop-types";
import { Masonry } from "@mui/lab";
import { DebInfo, PythonInfo, ImageInfo} from "../components";
import { RPMInfo } from "../components/DebInfo";

export const ImageSummary = ({ metrics, imageDocument, imageMetadata }) => {
    console.log(metrics)
    return (
        <Masonry columns={{ xs: 1, md: 2 }} spacing={3} mb={3} mt={1}>
            <div>
                <InfoCard
                    cardMeta={{
                        title: "Image Details",
                    }}
                    cardBody={
                        <ImageInfo imageDocument={imageDocument} imageMetadata={imageMetadata}/>
                    }
                />
            </div>

                {imageDocument?.result?.["python-interpreters"]?.length > 0
                    ?  <div><InfoCard
                        cardMeta={{
                            title: "Python Details",
                        }}
                        cardBody={
                            <PythonInfo imageDocument={imageDocument} />
                        }
                    /></div>
                    : undefined
                }


                {imageDocument?.result?.["rpm-dependencies"]?.length > 0
                    ? <div><InfoCard
                        cardMeta={{
                            title: "RPM Details",
                        }}
                        cardBody={
                            <RPMInfo imageDocument={imageDocument} />
                        }
                    /></div>
                    : undefined
                }


                {imageDocument.result?.deb?.length > 0
                    ? <div><InfoCard
                        cardMeta={{
                            title: "Debian Details",
                        }}
                        cardBody={
                            <DebInfo imageDocument={imageDocument} />
                        }
                    /> </div>
                    : undefined
                }


                {Object.keys(metrics?.dependencies?.all ?? {}).length !== 0
                ?  <div><InfoCard
                        cardMeta={{
                            title: "Python Packages Dependencies",
                        }}
                        cardBody={
                            <DependenciesMetric
                                all={metrics?.dependencies?.all}
                                roots={metrics?.dependencies?.roots}
                            />
                        }
                    /></div>
                : undefined
                }


                {Object.keys(metrics?.licenses ?? {}).length !== 0
                ?  <div><InfoCard
                        cardMeta={{
                            title: "Python Packages Licenses",
                        }}
                        cardBody={
                            <LicenseMetric metric={metrics?.licenses} />
                        }
                    /> </div>
                : undefined
                }


        </Masonry>
    );
};

ImageSummary.propTypes = {
    metrics: PropTypes.object,
    imageDocument: PropTypes.object,
    imageMetadata: PropTypes.object
};
