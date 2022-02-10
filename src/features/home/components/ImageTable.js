import * as React from "react";
import PropTypes from "prop-types";
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
import { CircularProgress } from "@material-ui/core";
import { NotFound } from "routes/NotFound";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

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
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
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

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

export default function ImageTable() {
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("calories");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const navigate = useNavigate();

    const images = useContainerImages();

    const rows = useMemo(() => {
        if (images?.data?.data?.container_images) {
            return images?.data?.data?.container_images.map(image => {
                image["date"] = timeSince(new Date(image.datetime)) + " ago";
                return image;
            });
        }
    }, [images?.data]);

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

    const handleAnalyze = (package_extract_document_id, environment_name) => {
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
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {rows
                                .slice()
                                .sort(getComparator(order, orderBy))
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
                                            key={row.environment_name + index}
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
