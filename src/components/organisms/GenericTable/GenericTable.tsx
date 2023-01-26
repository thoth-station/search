import * as React from "react";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@mui/material";

import { EnhancedTableHead, IEnhancedTableHead } from "./EnhancedTableHead";
import { getComparator } from "./utils";
import Loading from "components/atoms/Loading";

export interface IGenericTable {
  headers: {
    id: string;
    label: string;
  }[];
  rows: { [key: string]: unknown }[];
  onAction?: (row: any) => void;
}

const GenericTable = ({ headers, rows, onAction }: IGenericTable) => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState<typeof headers[number]["id"]>(headers[0].id);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (property: typeof headers[number]["id"]) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  if (!rows) {
    return (
      <div data-testid="loading-spinner" className="w-full h-48 flex justify-center items-center">
        <Loading isLoading />
      </div>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }} variant="outlined">
        <TableContainer>
          <Table sx={{ minWidth: 750 }} size="medium">
            <EnhancedTableHead
              order={order as IEnhancedTableHead["order"]}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headers={headers}
            />
            <TableBody>
              {rows
                .slice()
                .sort(getComparator(order as IEnhancedTableHead["order"], orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow hover tabIndex={-1} key={labelId}>
                      {headers.map((header, j) => {
                        if (j === 0) {
                          return (
                            <TableCell
                              data-testid="table-cell"
                              component="th"
                              id={labelId}
                              scope="row"
                              key={header.id + j}
                            >
                              {row[header.id] as string}
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell data-testid="table-cell" key={header.id + j} align="left">
                              {row[header.id] as string}
                            </TableCell>
                          );
                        }
                      })}

                      {onAction ? (
                        <TableCell align="right">
                          <IconButton data-testid="action-button" onClick={() => onAction(row)}>
                            <ArrowForwardRoundedIcon />
                          </IconButton>
                        </TableCell>
                      ) : undefined}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default GenericTable;
