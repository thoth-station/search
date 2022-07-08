// react
import React, { useMemo } from "react";

// material-ui
import { Box, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { Chip } from "@mui/material";
import { ImageDocumentRequestResponseSuccess } from "../../api";

interface IPythonInfo {
  imageDocument?: ImageDocumentRequestResponseSuccess;
}

/**
 * A metric card displaying dependency information of a single package.
 */
export const PythonInfo = ({ imageDocument }: IPythonInfo) => {
  if (!imageDocument) {
    return (
      <Box data-testid="python-info-not-loaded">
        <Skeleton />
        <Skeleton />
        <Skeleton width={"60%"} />
      </Box>
    );
  }

  const files = useMemo(() => {
    if (!imageDocument?.result?.["python-files"]) {
      return [];
    }

    const paths = new Map();
    imageDocument.result["python-files"].forEach(file => {
      const split = file.filepath.split("/", 4);
      const key = split[1] + "/" + split[2] + "/" + split[3];
      if (paths.has(key)) {
        paths.set(key, paths.get(key) + 1);
      } else {
        paths.set(key, 1);
      }
    });
    return Array.from(paths.entries()).map(([key, value]) => {
      return {
        path: key,
        count: value,
      };
    });
  }, [imageDocument]);

  const interpreters = useMemo(() => {
    return imageDocument.result["python-interpreters"].filter(interpreter => !!interpreter.version);
  }, [imageDocument]);

  return (
    <Stack direction="column" spacing={3}>
      {interpreters?.length > 0 ? (
        <Stack direction="row" spacing={1} alignItems={"center"}>
          <Typography variant={"h6"}>Python interpreters: </Typography>
          {interpreters.map((interpreter, i) => {
            return (
              <Chip data-testid="python-info-chip" key={(interpreter?.version ?? "") + i} label={interpreter.version} />
            );
          })}
        </Stack>
      ) : undefined}
      <div data-testid="python-info-loaded">
        <Stack direction="row" spacing={1} mb={1} alignItems={"center"}>
          <Typography variant={"h6"}>Total number of Python files: </Typography>
          <Typography variant={"body1"}>{files.reduce((prev, cur) => prev + cur.count, 0)}</Typography>
        </Stack>
        <Grid container>
          {files
            .sort((a, b) => b.count - a.count)
            .map(file => {
              return (
                <Grid key={file.path} item xs={12} lg={6} xl={4}>
                  <Stack ml={3} direction="row" spacing={1} alignItems={"center"} justifyContent={"space-between"}>
                    <Typography variant={"body2"}>{file.path}:</Typography>
                    <Typography variant={"body2"}>
                      <b>{file.count}</b>
                    </Typography>
                  </Stack>
                </Grid>
              );
            })}
        </Grid>
      </div>
    </Stack>
  );
};
