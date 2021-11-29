import {
  TableHead,
  TableRow,
  TableSortLabel,
  Box,
  TableCell
} from "@material-ui/core";

import { visuallyHidden } from "@material-ui/utils";

import PropTypes from "prop-types";

const headCells = [
  {
    id: "name",
    numeric: false,
    label: "Package"
  },
  {
    id: "depth",
    numeric: true,
    label: "Depth"
  },
  {
    id: "license",
    numeric: false,
    label: "License"
  },
  {
    id: "dependencies",
    numeric: true,
    label: "Direct Dependencies"
  }
];

/**
 * A specific custom table header for packages.
 * It handles sorting individual columns.
 */
function EnhancedTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  /** the function used to sort an individual column */
  onRequestSort: PropTypes.func.isRequired,
  /** the order in which the column is sorted on*/
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  /** The column in which to order the table by */
  orderBy: PropTypes.string.isRequired
};

export default EnhancedTableHead;
