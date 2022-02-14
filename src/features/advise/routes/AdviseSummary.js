import React from "react";
import InfoCard from "components/Elements/InfoCard";
import { CustomCardAction } from "../components";
import PropTypes from "prop-types";
import {
    AdviseMetric,
    DependenciesMetric,
    LicenseMetric,
} from "components/Metrics";
import { Masonry } from "@mui/lab";

export const AdviseSummary = ({ metrics }) => {
    const [pipfile, setPipfile] = React.useState("newGraph");

    const handlePipfile = (event, newPipfile) => {
        if (newPipfile?.length) {
            setPipfile(newPipfile);
        }
    };

    return (
        <Masonry columns={{ xs: 1, md: 2 }} spacing={3} mb={3} mt={1}>
            <div>
                <InfoCard
                    cardMeta={{
                        title: "Thoth Advise Summary",
                    }}
                    cardBody={<AdviseMetric metric={metrics?.advise} />}
                />
            </div>
            <div>
                <InfoCard
                    cardMeta={{
                        title: "Dependencies Summary",
                    }}
                    cardBody={
                        <DependenciesMetric
                            all={metrics?.[pipfile]?.dependencies?.all}
                            roots={metrics?.[pipfile]?.dependencies?.roots}
                        />
                    }
                    cardAction={
                        <CustomCardAction
                            value={pipfile}
                            onChange={handlePipfile}
                        />
                    }
                />
            </div>
            <div>
                <InfoCard
                    cardMeta={{
                        title: "Licenses Summary",
                    }}
                    cardBody={
                        <LicenseMetric metric={metrics?.[pipfile]?.licenses} />
                    }
                    cardAction={
                        <CustomCardAction
                            value={pipfile}
                            onChange={handlePipfile}
                        />
                    }
                />
            </div>
        </Masonry>
    );
};

AdviseSummary.propTypes = {
    metrics: PropTypes.object,
};
