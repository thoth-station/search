import React, {useContext, useEffect, useState} from "react";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from "@material-ui/core";

import AddRoundedIcon from "@material-ui/icons/AddRounded";
import RemoveRoundedIcon from "@material-ui/icons/RemoveRounded";
import CircleOutlinedIcon from "@material-ui/icons/CircleOutlined";

// utils
import { getComparator, stableSort } from "./utils";

// local
import EnhancedTableHead from "./EnhancedTableHead";
import PropTypes from "prop-types";
import {Graph} from "utils/Graph";
import {SelectedPackageContext} from "../../routes/AdviseDetails";

/**
 * The table cells and total structure specific to
 * python packages.
 */
export function AdviseTableView({
  search ="",
  filteredGraph
}) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [rows, setRows] = React.useState([]);
  const {selected, setSelected} = useContext(SelectedPackageContext) ?? {setSelected: () => console.log("missing callback")}


  // format data
  useEffect(() => {
    if (!filteredGraph) {
      return;
    }

    setPage(0);

    const newRows = [];
    filteredGraph.nodes.forEach(node => {
      if (node.value.depth === -1) {
        return;
      }
      newRows.push({
        name: node.value.label,
        key: node.key,
        warnings: [],
        depth: node.value?.depth ?? -1,
        license: node?.value?.metadata?.license,
        dependencies: node.adjacents.size,
        change: node.value?.change,
        summary: node?.value?.metadata?.summary
      });
    });
    setRows(newRows);
  }, [filteredGraph]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} size="medium">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
              .filter(row => row.name.includes(search))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                const iconColor =
                  row.change === "removed"
                    ? "error"
                    : row.change === "added"
                    ? "success"
                    : undefined;

                return (
                  <React.Fragment key={row.name}>
                    <TableRow
                      hover
                      onClick={() => setSelected(row.key)}
                      tabIndex={-1}
                      selected={selected === row.key}
                    >
                      <TableCell component="th" id={labelId} scope="row">
                        <Box display="flex">
                          {row.change === "removed" ? (
                            <RemoveRoundedIcon color={iconColor} />
                          ) : row.change === "added" ? (
                            <AddRoundedIcon color={iconColor} />
                          ) : (
                            <CircleOutlinedIcon />
                          )}
                          <Typography ml={2}>{row.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{row.depth}</TableCell>
                      <TableCell align="right">{row.license}</TableCell>
                      <TableCell align="right">{row.dependencies}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={6}
                      />
                    </TableRow>
                  </React.Fragment>
                );
              })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}

AdviseTableView.propTypes = {
  /** the text value used to filter the cells in the table */
  search: PropTypes.string,
  /** The graph used as input into the table */
  filteredGraph: PropTypes.objectOf(Graph).isRequired,
}
