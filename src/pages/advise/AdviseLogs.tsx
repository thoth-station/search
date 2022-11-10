import React, { useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Chip } from "@mui/material";
import ScrollToTop from "components/atoms/ScrollToTop";
import { useAdviseLogs } from "api";

export const AdviseLogs = ({ analysis_id }: { analysis_id: string }) => {
  const { log } = useAdviseLogs(analysis_id);

  const rows = useMemo(() => {
    return log
      ?.split("\n")
      .slice(0, 20)
      .map(line => {
        let log;
        try {
          log = JSON.parse(line);
        } catch (e) {
          return {};
        }

        if (log) {
          return {
            name: log.name,
            levelname: log.levelname,
            module: log.module,
            lineno: log.lineno,
            funcname: log.funcname,
            created: log.created,
            asctime: log.asctime,
            msecs: log.msecs,
            relative_created: log.relative_created,
            process: log.process,
            message: log.message,
          };
        } else {
          return {};
        }
      });
  }, [log]);

  return (
    <ScrollToTop>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small" aria-label="a dense table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Level</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Function</TableCell>
              <TableCell align="right">Line Number</TableCell>
              <TableCell align="right">Process</TableCell>
              <TableCell align="left">Message</TableCell>
              <TableCell align="right">Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map(row => (
              <TableRow
                key={row.created}
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell component="th" scope="row">
                  {row.levelname ? (
                    <Chip color={row?.levelname?.toLowerCase() ?? "default"} label={row.levelname} />
                  ) : undefined}
                </TableCell>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.funcname}</TableCell>
                <TableCell align="right">{row.lineno}</TableCell>
                <TableCell align="right">{row.process}</TableCell>
                <TableCell align="left">{row.message}</TableCell>
                <TableCell align="right">{row.asctime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ScrollToTop>
  );
};
