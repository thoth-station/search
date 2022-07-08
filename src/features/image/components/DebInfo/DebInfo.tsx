// react
import React from "react";
import { DataGrid } from "@mui/x-data-grid";

// material-ui
import { Box, Skeleton } from "@mui/material";
import { components } from "lib/schema";

interface IDebInfo {
  /** An object holding metric info. */
  imageDocument: components["schemas"]["AnalysisResultResponse"];
}

const columns = [
  { field: "name", headerName: "Package Name", flex: 1 },
  { field: "version", headerName: "Version", flex: 0.5 },
  { field: "arch", headerName: "Architecture", flex: 0.5 },
];

/**
 * A metric card displaying dependency information of a single package.
 */
export const DebInfo = ({ imageDocument }: IDebInfo) => {
  if (!imageDocument) {
    return (
      <Box>
        <Skeleton />
        <Skeleton />
        <Skeleton width={"60%"} />
      </Box>
    );
  }

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        disableSelectionOnClick
        disableColumnSelector
        hideFooterSelectedRowCount
        getRowId={row => row.package_identifier}
        density="compact"
        rows={imageDocument?.result?.["deb"]}
        columns={columns}
        pageSize={50}
        rowsPerPageOptions={[25, 50, 100]}
      />
    </div>
  );
};
