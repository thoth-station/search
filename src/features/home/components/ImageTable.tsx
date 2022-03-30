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
import timeSince from "utils/timeSince";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContainerImages } from "../api";
import { useMemo } from "react";
import { CircularProgress } from "@mui/material";
import { NotFound } from "routes/NotFound";

const headCells = [
    {
        id: "environment_name",
        label: "Image Name",
    },
    {
        id: "os_name",
        label: "OS Name",
    },
    {
        id: "os_version",
        label: "OS Version",
    },
    {
        id: "python_version",
        label: "Python Version",
    },
    {
        id: "datetime",
        label: "Last Updated",
    },
];

function descendingComparator(
    a: { [key: string]: any },
    b: { [key: string]: any },
    orderBy: string,
) {
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
        ? (a: { [key: string]: any }, b: { [key: string]: any }) =>
              descendingComparator(a, b, orderBy)
        : (a: { [key: string]: any }, b: { [key: string]: any }) =>
              -descendingComparator(a, b, orderBy);
}

interface IEnhancedTableHead {
    order: "asc" | "desc";
    orderBy: typeof headCells[number]["id"];
    onRequestSort: (property: typeof headCells[number]["id"]) => void;
    rowCount: number;
}

function EnhancedTableHead(props: IEnhancedTableHead) {
    const { order, orderBy, onRequestSort } = props;
    const createSortHandler = (property: typeof headCells[number]["id"]) => {
        onRequestSort(property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
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

export default function ImageTable() {
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] =
        React.useState<typeof headCells[number]["id"]>("datetime");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const navigate = useNavigate();

    const images = useContainerImages({ useErrorBoundary: false });

    const rows = useMemo(() => {
        if (images?.data?.data?.container_images) {
            return images?.data?.data?.container_images.map(image => {
                return {
                    ...image,
                    date: timeSince(new Date(image.datetime)) + " ago",
                };
            });
        } else {
            return [];
        }
    }, [images?.data]);

    const handleRequestSort = (property: typeof headCells[number]["id"]) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleChangePage = (
        event: any,
        newPage: React.SetStateAction<number>,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleAnalyze = (
        package_extract_document_id: string,
        environment_name: string | null,
    ) => {
        navigate("/image/" + package_extract_document_id, {
            state: { image_name: environment_name },
        });
    };

    if (images.isError) {
        return <NotFound />;
    }

    if (!rows) {
        return (
            <div className="w-full h-48 flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    }

    return (
        <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} size="medium">
                        <EnhancedTableHead
                            order={order as IEnhancedTableHead["order"]}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {rows
                                .slice()
                                .sort(
                                    getComparator(
                                        order as IEnhancedTableHead["order"],
                                        orderBy,
                                    ),
                                )
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage,
                                )
                                .map((row, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={
                                                (row?.environment_name ?? "") +
                                                index
                                            }
                                        >
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                            >
                                                {row.environment_name}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.os_name}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.os_version}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.python_version}
                                            </TableCell>
                                            <TableCell align="left">
                                                {row.date}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    onClick={() =>
                                                        handleAnalyze(
                                                            row.package_extract_document_id,
                                                            row.environment_name,
                                                        )
                                                    }
                                                >
                                                    <ArrowForwardRoundedIcon />
                                                </IconButton>
                                            </TableCell>
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
