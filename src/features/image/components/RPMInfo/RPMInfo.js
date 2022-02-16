// react
import React from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";

// material-ui
import { Box, Skeleton } from "@mui/material";

const columns = [
    { field: "name", headerName: "Package Name", flex: 1 },
    { field: "version", headerName: "Version", flex: 0.5 },
    { field: "release", headerName: "Release", flex: 0.25 },
    {
        field: "dependencies",
        headerName: "Dependencies",
        flex: 0.5,
        valueGetter: params => params.row?.dependencies?.length ?? 0,
        sortable: false,
    },
    { field: "epoch", headerName: "Epoch", flex: 0.5 },
    { field: "arch", headerName: "Architecture", flex: 0.5 },
];

/**
 * A metric card displaying dependency information of a single package.
 */
export const RPMInfo = ({ imageDocument }) => {
    if (!imageDocument) {
        return (
            <Box data-testid="rpm-info-not-loaded">
                <Skeleton />
                <Skeleton />
                <Skeleton width={"60%"} />
            </Box>
        );
    }

    return (
        <div
            style={{ height: 400, width: "100%" }}
            data-testid="rpm-info-loaded"
        >
            <DataGrid
                disableSelectionOnClick
                disableColumnSelector
                hideFooterSelectedRowCount
                getRowId={row => row.package_identifier}
                density="compact"
                rows={imageDocument?.result?.["rpm-dependencies"]}
                columns={columns}
                pageSize={50}
                rowsPerPageOptions={[25, 50, 100]}
            />
        </div>
    );
};

RPMInfo.propTypes = {
    /** An object holding metric info. */
    imageDocument: PropTypes.shape({
        result: PropTypes.object,
        metadata: PropTypes.object,
    }),
};
