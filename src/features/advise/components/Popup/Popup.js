// react
import React from "react";

import { Typography, Grid } from "@mui/material";
import GavelIcon from "@material-ui/icons/Gavel";
import BookmarkIcon from "@material-ui/icons/Bookmark";

// local
import IconText from "components/Elements/IconText";
import PropTypes from "prop-types";
import { Node } from "utils/Node";

/**
 * Graph hover model appears when you hover over a node on the graph.
 */
const Popup = ({ node }) => {
    return (
        <div>
            <Grid container alignItems="center">
                <Grid item xs={6}>
                    <Typography variant="h6">
                        <b>{node.value.id}</b>
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography ml={2} variant="body1">
                        v{node.value.version ?? "NaN"}
                    </Typography>
                </Grid>
            </Grid>
            <Typography gutterBottom variant="body2">
                {node.value?.metadata?.Summary ?? "NaN"}
            </Typography>
            <Grid container spacing={2}>
                <Grid item>
                    <IconText
                        text={node.value?.metadata?.License ?? "NaN"}
                        icon={<GavelIcon />}
                    />
                </Grid>
                <Grid item>
                    <IconText
                        ml={2}
                        text={
                            node.value?.latestVersion
                                ? "Latest version is installed"
                                : "Installed version is NOT the latest."
                        }
                        icon={<BookmarkIcon />}
                    />
                </Grid>
            </Grid>
            <Typography variant="body2" mt={2}>
                {node.value?.justifications?.header}
            </Typography>
        </div>
    );
};

Popup.propTypes = {
    node: PropTypes.objectOf(Node),
};

export default Popup;
