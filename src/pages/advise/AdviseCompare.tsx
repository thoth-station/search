import React, { ReactElement, useEffect, useMemo, useState } from "react";

import {
  Box,
  Grid,
  FormControl,
  Stack,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Switch,
  FormControlLabel,
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";

import { LOCAL_STORAGE_KEY } from "config";
import { components } from "lib/schema";

import { useNavigate, useParams } from "react-router-dom";
import { useAdviseDocument, getAdviseDocument, AdviseDocumentRequestResponse } from "api";
import ScrollToTop from "components/atoms/ScrollToTop";
import { Lockfile } from "utils/formatLockfile";
import { Variant } from "@mui/material/styles/createTypography";
import { PipfileRequirements } from "lib/types/Pipfile";

interface IAdviseCompare {
  analysis_id?: string;
}

export const AdviseCompare = ({ analysis_id }: IAdviseCompare) => {
  const params = useParams();
  const navigate = useNavigate();
  const { data: adviseDocument } = useAdviseDocument(analysis_id);

  useEffect(() => {
    if (params.cmp) {
      setComparison(params.cmp);
    }
  }, [params.cmp]);

  const [comparison, setComparison] = React.useState(adviseDocument?.metadata?.document_id ?? "");

  const { data: compareDoc } = useAdviseDocument(comparison);

  const [open, setOpen] = React.useState(false);
  const [differencesOnly, setDifferencesOnly] = React.useState(false);

  const [importText, setImportText] = React.useState<string | null>("");

  const [optionList, setOptionList] = useState<
    ({
      id: string;
      readable: ReactElement;
      timestamp: number;
    } | null)[]
  >([]);

  useEffect(() => {
    let active = true;
    load();
    return () => {
      active = false;
    };

    async function load() {
      setOptionList([]); // this is optional

      const options = await Promise.all(
        localHistory.map(item => {
          // get detail of runs
          return getAdviseDocument(item)
            .then(doc => {
              const env = (doc.data?.result?.parameters as { project: components["schemas"]["ProjectDef"] })?.project
                ?.runtime_environment;

              if (env) {
                return {
                  id: item,
                  timestamp: doc.data?.metadata?.timestamp ?? 0,
                  readable: (
                    <Typography>
                      <i>{new Date(doc.data?.metadata?.datetime).toLocaleString()}</i> : <b>{env?.name ?? "N/A"}</b>,{" "}
                      {env?.operating_system?.name}-{env?.operating_system?.version} (Python {env?.python_version})
                    </Typography>
                  ),
                };
              } else {
                return null;
              }
            })
            .catch(() => {
              return null;
            });
        }),
      );

      if (!active) {
        return;
      }
      setOptionList(options);
    }
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event?: any, reason?: string) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  const handleImport = async () => {
    if (importText) {
      await getAdviseDocument(importText)
        .then(() => {
          const ids = localStorage.getItem(LOCAL_STORAGE_KEY) ?? "";

          const split = ids.split(",");
          if (!split.includes(importText)) {
            split.push(importText);
            localStorage.setItem(LOCAL_STORAGE_KEY, split.join(","));
          }

          setImportText("");
          setOpen(false);
          setComparison(importText);
          navigate("../compare/" + importText);
        })
        .catch(() => {
          setImportText(null);
        });
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setComparison(event.target.value);
    navigate("../compare/" + event.target.value);
  };

  const localHistory: string[] = useMemo(() => {
    const history: string[] = [];

    const ids = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (ids) {
      history.push(...ids.split(",").filter(s => s !== ""));
    }

    return history;
  }, [importText === ""]);

  const COMPARE_COLORS = {
    old: {
      text: "#b31412",
      background: "#fad2cf",
    },
    new: {
      text: "#217f70",
      background: "#e3fbf7",
    },
    change: {
      text: "#b38012",
      background: "#fae7cf",
    },
    equal: {
      text: undefined,
      background: undefined,
    },
  };

  const comparePaths = (obj1: any, obj2: any, label?: string, mapping = (obj: typeof obj1) => obj) => {
    // if not null
    const obj1_mapped = obj1 ? mapping(obj1) : null;
    const obj2_mapped = obj2 ? mapping(obj2) : null;

    // compare if equal
    if (obj1_mapped && obj2_mapped) {
      if (obj1_mapped === obj2_mapped) {
        if (!differencesOnly) {
          return (
            <React.Fragment key={label}>
              {renderCompareLine(obj1_mapped as string, "equal", label)}
              {renderCompareLine(obj2_mapped as string, "equal", label)}
            </React.Fragment>
          );
        }
      } else {
        return (
          <React.Fragment key={label}>
            {renderCompareLine(obj1_mapped as string, "change", label)}
            {renderCompareLine(obj2_mapped as string, "change", label)}
          </React.Fragment>
        );
      }
    } else if (obj1_mapped) {
      return (
        <React.Fragment key={label}>
          {renderCompareLine(obj1_mapped as string, "old", label)}
          {renderCompareLine(obj2_mapped as string, "", label)}
        </React.Fragment>
      );
    } else if (obj2_mapped) {
      return (
        <React.Fragment key={label}>
          {renderCompareLine(obj1_mapped as string, "", label)}
          {renderCompareLine(obj2_mapped as string, "new", label)}
        </React.Fragment>
      );
    } else {
      return undefined;
    }
  };

  const renderCompareLine = (value: string, compareType: "old" | "new" | "equal" | "change" | "", label?: string) => {
    const borderStyles = {
      height: "100%",
      paddingBottom: 0.25,
      paddingTop: 0.25,
      borderRadius: 0,
      borderStyle: "hidden solid hidden solid",
      overflow: "hidden",
    };
    if (compareType) {
      return (
        <Grid item xs={6}>
          <Paper
            variant="outlined"
            sx={{
              backgroundColor: COMPARE_COLORS[compareType].background,
              ...borderStyles,
            }}
          >
            <Stack direction="row">
              {compareType !== "equal" ? (
                <Typography
                  fontWeight="bold"
                  sx={{
                    textAlign: "center",
                    minWidth: "2rem",
                    color: COMPARE_COLORS[compareType].text,
                  }}
                  variant="body2"
                >
                  {compareType === "old" ? "-" : compareType === "new" ? "+" : "~"}
                </Typography>
              ) : (
                <Box sx={{ minWidth: "2rem" }} />
              )}
              {label ? (
                <Typography
                  sx={{
                    marginRight: 1,
                    color: COMPARE_COLORS[compareType].text,
                  }}
                  variant="body2"
                  fontWeight="bold"
                >
                  {label + ":"}
                </Typography>
              ) : undefined}
              <Typography sx={{ color: COMPARE_COLORS[compareType].text }} display="inline" variant="body2">
                {value.toString()}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={6}>
          <Paper
            variant="outlined"
            sx={{
              backgroundColor: COMPARE_COLORS["equal"].background,
              ...borderStyles,
            }}
          >
            <Box />
          </Paper>
        </Grid>
      );
    }
  };

  const doubleRenderTypography = (
    variant: Variant,
    text: string,
    styleOverrides: { [key: string]: string | number | undefined } = {},
  ) => {
    const headerStyles = {
      paddingLeft: 4,
      paddingBottom: 1,
      paddingTop: 4,
      borderRadius: 0,
      borderStyle: "hidden solid hidden solid",
      ...styleOverrides,
    };
    return (
      <>
        <Grid item xs={6}>
          <Paper
            variant="outlined"
            sx={{
              ...headerStyles,
            }}
          >
            <Typography variant={variant}>{text}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper
            variant="outlined"
            sx={{
              ...headerStyles,
            }}
          >
            <Typography variant={variant}>{text}</Typography>
          </Paper>
        </Grid>
      </>
    );
  };

  const compareArrays = (array1: any[] = [], array2: any[] = [], mapping = (obj: any) => obj) => {
    const s1 = array1.map(e => JSON.stringify(e));
    const s2 = array2.map(e => JSON.stringify(e));
    const set1 = new Set(s1);
    const set2 = new Set(s2);

    const merged = [...new Set([...s1, ...s2])];

    return merged.sort().map(key => {
      const value = JSON.parse(key);
      return comparePaths(set1.has(key) ? value : undefined, set2.has(key) ? value : undefined, undefined, mapping);
    });
  };

  const createProjectCompare = (
    proj1?: components["schemas"]["ProjectDef"],
    proj2?: components["schemas"]["ProjectDef"],
  ) => {
    const runtimeEnvironment: (keyof components["schemas"]["RuntimeEnvironment"])[] = [
      "name",
      "python_version",
      "cuda_version",
      "openblas_version",
      "openmpi_version",
      "cudnn_version",
      "mkl_version",
      "platform",
      "base_image",
    ];
    const dev_packages = [
      ...new Set([
        ...Object.keys((proj1?.requirements as PipfileRequirements)?.["dev-packages"] ?? {}),
        ...Object.keys((proj2?.requirements as PipfileRequirements)?.["dev-packages"] ?? {}),
      ]),
    ];
    const packages = [
      ...new Set([
        ...Object.keys((proj1?.requirements as PipfileRequirements)?.packages ?? {}),
        ...Object.keys((proj2?.requirements as PipfileRequirements)?.packages ?? {}),
      ]),
    ];
    const requirements_locked = [
      ...new Set([
        ...Object.keys((proj1?.requirements_locked as Lockfile)?.default ?? {}),
        ...Object.keys((proj2?.requirements_locked as Lockfile)?.default ?? {}),
      ]),
    ];

    return (
      <React.Fragment>
        {dev_packages.length > 0
          ? doubleRenderTypography("h6", "Pipfile Dev Packages", {
              paddingTop: 0.5,
              paddingBottom: 0.5,
            })
          : undefined}
        {dev_packages.map(key => {
          return comparePaths(
            (proj1?.requirements as PipfileRequirements)?.["dev-packages"][key],
            (proj2?.requirements as PipfileRequirements)?.["dev-packages"][key],
            key,
          );
        })}

        {packages.length > 0
          ? doubleRenderTypography("h6", "Pipfile Packages", {
              paddingTop: 0.5,
              paddingBottom: 0.5,
            })
          : undefined}
        {packages.map(key => {
          return comparePaths(
            (proj1?.requirements as PipfileRequirements)?.packages[key],
            (proj2?.requirements as PipfileRequirements)?.packages[key],
            key,
          );
        })}

        {doubleRenderTypography("h6", "Pipfile.lock Sources")}
        {compareArrays(
          (proj1?.requirements_locked as Lockfile)?._meta?.sources,
          (proj2?.requirements_locked as Lockfile)?._meta?.sources,
          obj => {
            return `${obj.name} (${obj.url})`;
          },
        )}

        {doubleRenderTypography("h6", "Pipfile.lock Packages")}
        {requirements_locked.map(key => {
          return comparePaths(
            (proj1?.requirements_locked as Lockfile)?.default[key],
            (proj2?.requirements_locked as Lockfile)?.default[key],
            key,
            obj => {
              return obj?.version;
            },
          );
        })}

        {doubleRenderTypography("h6", "Runtime Environment")}
        {runtimeEnvironment.map(field => {
          return comparePaths(proj1?.runtime_environment?.[field], proj2?.runtime_environment?.[field], field);
        })}

        {comparePaths(
          proj1?.runtime_environment?.operating_system,
          proj1?.runtime_environment?.operating_system,
          "operating_system",
          obj => {
            return obj.name + " " + obj.version;
          },
        )}
        {comparePaths(proj1?.runtime_environment?.hardware, proj1?.runtime_environment?.hardware, "hardware", obj => {
          let text = "";
          text += obj.cpu_model ?? " ";
          text += obj.cpu_family ?? " ";
          text += obj.gpu_model ?? " ";
          if (text.trim()) {
            return text;
          }
        })}
      </React.Fragment>
    );
  };

  const createCompare = (doc1: AdviseDocumentRequestResponse, doc2: AdviseDocumentRequestResponse) => {
    const metadataFields: (keyof AdviseDocumentRequestResponse["metadata"])[] = [
      "document_id",
      "analyzer",
      "analyzer_version",
      "datetime",
      "thoth_deployment_name",
    ];
    const argumentFields: string[] = [
      "beam_width",
      "constraints",
      "count",
      "dev",
      "labels",
      "library_usage",
      "limit",
      "limit_latest_versions",
      "no_pretty",
      "output",
      "pipeline",
      "plot",
      "predictor",
      "recommendation_type",
      "requirements",
      "requirements_format",
      "requirements_locked",
      "runtime_environment",
      "seed",
      "user_stack_scoring",
    ];
    const distributionFields: (keyof AdviseDocumentRequestResponse["metadata"]["distribution"])[] = [
      "codename",
      "id",
      "like",
      "version",
    ];
    const osReleaseFields: (keyof AdviseDocumentRequestResponse["metadata"]["os_release"])[] = [
      "id",
      "name",
      "platform_id",
      "version",
    ];

    return (
      <>
        {doubleRenderTypography("h5", "Result", { paddingTop: 0 })}
        {comparePaths(
          doc1?.result?.report?.accepted_final_states_count,
          doc2?.result?.report?.accepted_final_states_count,
          "accepted_final_states_count",
        )}
        {comparePaths(
          doc1?.result?.report?.discarded_final_states_count,
          doc2?.result?.report?.discarded_final_states_count,
          "discarded_final_states_count",
        )}
        {comparePaths(
          doc1?.result?.report?.resolver_iterations,
          doc2?.result?.report?.resolver_iterations,
          "resolver_iterations",
        )}
        {comparePaths(doc1?.result?.report?.pipeline, doc2?.result?.report?.pipeline, "pipeline")}

        {createProjectCompare(
          doc1?.result?.report?.products?.[0]?.project,
          doc2?.result?.report?.products?.[0]?.project,
        )}

        {doubleRenderTypography("h6", "Advised Manifest Changes")}
        {compareArrays(
          doc1?.result?.report?.products?.[0]?.advised_manifest_changes ?? [],
          doc2?.result?.report?.products?.[0]?.advised_manifest_changes ?? [],
          obj => {
            let text = "";
            obj.forEach(
              (change: {
                patch: {
                  path: any;
                  op: any;
                  value: { name: any; value: any };
                };
              }) => {
                text += `[ ${change?.patch?.path}; ${change?.patch?.op}; ${change?.patch?.value?.name}: ${change?.patch?.value?.value} ]`;
              },
            );
            return text;
          },
        )}

        {doubleRenderTypography("h6", "Stack Info")}
        {compareArrays(doc1?.result?.report?.stack_info, doc2?.result?.report?.stack_info, obj => {
          return obj.message;
        })}

        {doubleRenderTypography("h5", "Metadata")}
        {metadataFields.map(field => {
          return comparePaths(doc1?.metadata?.[field], doc2.metadata?.[field], field);
        })}
        {comparePaths(doc1?.result?.error_msg, doc2?.result?.error_msg, "error_msg")}

        {doubleRenderTypography("h6", "Arguments")}
        {argumentFields.map(field => {
          return comparePaths(
            (
              doc1?.metadata?.arguments?.advise as {
                [key: string]: any;
              }
            )?.[field],
            (
              doc2?.metadata?.arguments?.advise as {
                [key: string]: any;
              }
            )?.[field],
            field,
          );
        })}

        {doubleRenderTypography("h6", "Distribution")}
        {distributionFields.map(field => {
          return comparePaths(doc1?.metadata?.distribution?.[field], doc2?.metadata?.distribution?.[field], field);
        })}

        {doubleRenderTypography("h6", "OS Release")}
        {osReleaseFields.map(field => {
          return comparePaths(
            doc1?.metadata?.os_release?.[field],
            doc2?.metadata?.os_release?.[field],
            field as string,
          );
        })}

        {doubleRenderTypography("h6", "Python")}
        {comparePaths(doc1?.metadata?.python, doc2?.metadata?.python, "version", obj => {
          return `${obj.major}.${obj.minor}.${obj.micro}`;
        })}
        {comparePaths(doc1?.metadata?.python?.api_version, doc2?.metadata?.python?.api_version, "api_version")}
        {comparePaths(
          doc1?.metadata?.python?.implementation_name,
          doc2?.metadata?.python?.implementation_name,
          "implementation_name",
        )}
        {comparePaths(doc1?.metadata?.python?.releaselevel, doc2?.metadata?.python?.releaselevel, "release level")}
      </>
    );
  };

  const compareJSX = useMemo(() => {
    if (!adviseDocument || !compareDoc) {
      if (comparison === "Original Lockfile") {
        return (
          <React.Fragment>
            {createProjectCompare(
              adviseDocument?.result?.report?.products?.[0]?.project,
              (
                adviseDocument?.result?.parameters as {
                  project: components["schemas"]["ProjectDef"];
                }
              )?.project,
            )}
            {doubleRenderTypography("body1", " ", {
              borderBottomStyle: "solid",
              borderRadius: undefined,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            })}
          </React.Fragment>
        );
      }
      return undefined;
    }
    return (
      <>
        {createCompare(adviseDocument, compareDoc)}
        {doubleRenderTypography("body1", " ", {
          borderBottomStyle: "solid",
          borderRadius: undefined,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        })}
      </>
    );
  }, [adviseDocument, compareDoc, differencesOnly]);

  if (!adviseDocument) {
    return (
      <Box height="100vh" flexDirection="column" display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h5" align="center">
          Compare not available
        </Typography>
        <Typography variant="body2" align="center">
          The adviser has not finished resolving packages
        </Typography>
      </Box>
    );
  }

  return (
    <ScrollToTop>
      <Box>
        <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
          <DialogTitle>Import another Advise document</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
              <TextField
                error={importText === null}
                onChange={event => setImportText(event.target.value)}
                label="Document ID"
                variant="outlined"
                size="small"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()}>Cancel</Button>
            <Button onClick={() => handleImport()}>Import</Button>
          </DialogActions>
        </Dialog>
        <Grid container mb={1} columnSpacing={10}>
          <Grid item xs={6}>
            <Paper
              variant="outlined"
              sx={{
                height: "100%",
                borderTopStyle: "solid",
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                paddingBottom: 4,
                paddingTop: 4,
                borderStyle: "solid solid hidden solid",
              }}
            >
              <Typography
                sx={{
                  textAlign: "center",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
                fontWeight="bold"
                variant="h6"
              >
                Current Advise Document
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper
              variant="outlined"
              sx={{
                height: "100%",
                borderTopStyle: "solid",
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                paddingBottom: 4,
                paddingTop: 4,
                borderStyle: "solid solid hidden solid",
              }}
            >
              <Stack direction="row" spacing={1} sx={{ marginX: "10%" }}>
                <FormControl fullWidth>
                  <Select value={comparison} displayEmpty onChange={handleChange} size="small">
                    <MenuItem disabled value="">
                      <em>Select a comparison</em>
                    </MenuItem>

                    {(adviseDocument?.result?.parameters?.project as components["schemas"]["ProjectDef"])
                      ?.requirements_locked && <MenuItem value="Original Lockfile">Original Lockfile</MenuItem>}

                    {optionList
                      .sort((a, b) => (b ? b.timestamp : 0) - (a ? a.timestamp : 0))
                      .map(option => {
                        if (option) {
                          return (
                            <MenuItem key={option.id} value={option.id}>
                              {option.readable}
                            </MenuItem>
                          );
                        }
                      })}
                  </Select>
                </FormControl>
                <IconButton onClick={handleClickOpen}>
                  <AddRoundedIcon />
                </IconButton>
              </Stack>
              <FormControlLabel
                sx={{ marginX: "10%", marginTop: 0.5 }}
                control={
                  <Switch
                    defaultChecked
                    checked={differencesOnly}
                    onChange={event => setDifferencesOnly(event.target.checked)}
                  />
                }
                label="Differences only"
              />
            </Paper>
          </Grid>
          {compareJSX}
        </Grid>
      </Box>
    </ScrollToTop>
  );
};
