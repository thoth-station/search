import React from "react";

import {
    TableHead,
    TableRow,
    TableSortLabel,
    Box,
    TableCell,
} from "@mui/material";

import { visuallyHidden } from "@mui/utils";

const headCells = [
    {
        id: "name",
        numeric: false,
        label: "Package",
    },
    {
        id: "depth",
        numeric: true,
        label: "Depth",
    },
    {
        id: "license",
        numeric: false,
        label: "License",
    },
    {
        id: "dependencies",
        numeric: true,
        label: "Direct Dependencies",
    },
];

interface IEnhancedTableHead {
    /** the function used to sort an individual column */
    onRequestSort: (c: string) => void;
    /** the order in which the column is sorted on*/
    order: "asc" | "desc";
    /** The column in which to order the table by */
    orderBy: string;
}

/**
 * A specific custom table header for packages.
 * It handles sorting individual columns.
 */
function EnhancedTableHead({
    order,
    orderBy,
    onRequestSort,
}: IEnhancedTableHead) {
    const createSortHandler = (property: string) => {
        onRequestSort(property);
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
                            onClick={() => createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === "desc"
                                        ? "sorted descending"
                                        : "sorted ascending"}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default EnhancedTableHead;
