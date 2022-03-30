import React, { useContext, useEffect, useState } from "react";

import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

// utils
import { getComparator, stableSort } from "./utils";

// local
import EnhancedTableHead from "./EnhancedTableHead";
import { SelectedPackageContext } from "../../routes/AdviseDetails";
import { Graph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";
import { PackageMergedNodeValue } from "lib/interfaces/PackageMergedNodeValue";

interface IAdviseTableView {
    /** the text value used to filter the cells in the table */
    search: string;
    filteredGraph: Graph<Node<PackageMergedNodeValue>>;
}

type Row = {
    name: string;
    key: string;
    warnings: [];
    depth: number;
    license: string;
    dependencies: number;
    change: string;
    summary: string;
};

/**
 * The table cells and total structure specific to
 * python packages.
 */
export function AdviseTableView({
    search = "",
    filteredGraph,
}: IAdviseTableView) {
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [orderBy, setOrderBy] = React.useState<string>("name");
    const [page, setPage] = React.useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = React.useState<number>(25);
    const [rows, setRows] = React.useState<Row[]>([]);

    const { selected, setSelected } = useContext(SelectedPackageContext) ?? {
        setSelected: () => console.log("missing callback"),
    };

    // format data
    useEffect(() => {
        if (!filteredGraph) {
            return;
        }

        setPage(0);

        const newRows: Row[] = [];
        filteredGraph.nodes.forEach(node => {
            if (node.value.depth === -1) {
                return;
            }
            newRows.push({
                name: node.value.label ?? node.key,
                key: node.key,
                warnings: [],
                depth: node.value?.depth ?? -1,
                license: node?.value?.metadata?.License ?? "",
                dependencies: node.adjacents.size,
                change: node.value?.change,
                summary: node?.value?.metadata?.Summary ?? "",
            });
        });
        setRows(newRows);
    }, [filteredGraph]);

    const handleRequestSort = (property: string) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: React.SetStateAction<number>,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
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
                            .filter((row: { name: string }) =>
                                row.name.includes(search),
                            )
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage,
                            )
                            .map((row: Row, index: number) => {
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
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                            >
                                                <Box display="flex">
                                                    {row.change ===
                                                    "removed" ? (
                                                        <RemoveRoundedIcon
                                                            color={iconColor}
                                                        />
                                                    ) : row.change ===
                                                      "added" ? (
                                                        <AddRoundedIcon
                                                            color={iconColor}
                                                        />
                                                    ) : (
                                                        <CircleOutlinedIcon />
                                                    )}
                                                    <Typography ml={2}>
                                                        {row.name}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.depth}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.license}
                                            </TableCell>
                                            <TableCell align="right">
                                                {row.dependencies}
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell
                                                style={{
                                                    paddingBottom: 0,
                                                    paddingTop: 0,
                                                }}
                                                colSpan={6}
                                            />
                                        </TableRow>
                                    </React.Fragment>
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
