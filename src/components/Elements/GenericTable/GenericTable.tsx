import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { IconButton } from "@mui/material";
import { CircularProgress } from "@mui/material";

function descendingComparator(a: { [key: string]: any }, b: { [key: string]: any }, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: "desc" | "asc", orderBy: string) {
  return order === "desc"
    ? (a: { [key: string]: any }, b: { [key: string]: any }) => descendingComparator(a, b, orderBy)
    : (a: { [key: string]: any }, b: { [key: string]: any }) => -descendingComparator(a, b, orderBy);
}

interface IGenericTable {
  headers: {
    id: string;
    label: string;
  }[];
  rows: { [key: string]: unknown }[];
  action?: (row: any) => void;
}

interface IEnhancedTableHead {
  order: "asc" | "desc";
  orderBy: IGenericTable["headers"][number]["id"];
  onRequestSort: (property: IGenericTable["headers"][number]["id"]) => void;
  rowCount: number;
  headers: IGenericTable["headers"];
}

function EnhancedTableHead(props: IEnhancedTableHead) {
  const { order, orderBy, onRequestSort, headers } = props;
  const createSortHandler = (property: typeof headers[number]["id"]) => {
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        {headers.map(headCell => (
          <TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={() => createSortHandler(headCell.id)}
            >
              <b>{headCell.label}</b>
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell />
      </TableRow>
    </TableHead>
  );
}

export default function GenericTable({ headers, rows, action }: IGenericTable) {
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
      <div className="w-full h-48 flex justify-center items-center">
        <CircularProgress />
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
                            <TableCell component="th" id={labelId} scope="row" key={header.id + j}>
                              {row[header.id] as string}
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell key={header.id + j} align="left">
                              {row[header.id] as string}
                            </TableCell>
                          );
                        }
                      })}

                      {action ? (
                        <TableCell align="right">
                          <IconButton onClick={() => action(row)}>
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
}
