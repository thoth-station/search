import * as React from "react";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { IGenericTable } from "./GenericTable";

export interface IEnhancedTableHead {
  order: "asc" | "desc";
  orderBy: IGenericTable["headers"][number]["id"];
  onRequestSort: (property: IGenericTable["headers"][number]["id"]) => void;
  rowCount: number;
  headers: IGenericTable["headers"];
}
export function EnhancedTableHead(props: IEnhancedTableHead) {
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
              data-testid="column-header-label"
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
