// react
import React from "react";
import PropTypes from "prop-types";

// material-ui

import { Card, CardContent, CardHeader, Typography } from "@mui/material";



/** Card template for metric cards. */
const InfoCard = ({ cardMeta, cardBody, cardAction }) => {
    

    return (
        <Card >
            <CardHeader
                action={cardAction}
                title={<Typography variant="h5">{cardMeta.title}</Typography>}
                subheader={cardMeta.subTitle}
            />
            <CardContent>{cardBody}</CardContent>
        </Card>
    );
};

InfoCard.propTypes = {
    /** card header info */
    cardMeta: PropTypes.shape({
        /** card title */
        title: PropTypes.string.isRequired,
        /** optional subtitle */
        subTitle: PropTypes.string,
    }),
    /** optional card action component (usually some button) */
    cardAction: PropTypes.node,
    /** Card body content */
    cardBody: PropTypes.node,
};

export default InfoCard;
