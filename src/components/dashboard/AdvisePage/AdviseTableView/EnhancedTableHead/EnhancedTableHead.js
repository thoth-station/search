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

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
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
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired
};

export default EnhancedTableHead;
