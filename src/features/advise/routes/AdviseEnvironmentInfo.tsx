import React, { useMemo, useState } from "react";
import { components } from "lib/schema";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Button,
  Typography,
  IconButton,
  TextField,
  Alert,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ChangeHistoryRoundedIcon from "@mui/icons-material/ChangeHistoryRounded";
import { postAdvise } from "../../home/api";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import yaml from "js-yaml";

interface IAdviseEnvironmentInfo {
  runtime_environment?: components["schemas"]["RuntimeEnvironment"] | null;
  pipfile: string;
  pipfileLock: string;
}

type ListData = {
  label: string;
  key: string;
  value?: string | number | null;
  original?: string | number | null;
  group?: {
    label: string;
    original?: string | number | null;
    value?: string | number | null;
    key: string;
  }[];
  detail: string;
};

export const EditableLabel = ({
  itemKey,
  itemSubKey,
  value,
  handleSubmit,
  label,
  editMode,
}: {
  itemKey: string;
  itemSubKey?: string;
  value: any;
  handleSubmit: (key: string, value: any, subKey?: string) => void;
  label?: string;
  editMode: boolean;
}) => {
  return (
    <>
      {editMode ? (
        <TextField
          value={value}
          label={label}
          onChange={event => handleSubmit(itemKey, event.target.value, itemSubKey)}
          size="small"
          variant="outlined"
        />
      ) : (
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          {itemSubKey ? (
            <Typography
              sx={{ marginRight: 1 }}
              variant="body1"
              fontStyle={!value ? "italic" : undefined}
              fontWeight={value ? "bold" : undefined}
            >
              {label}
            </Typography>
          ) : undefined}
          <Typography variant="body1" fontWeight={!itemSubKey ? "bold" : undefined}>
            {value}
          </Typography>
        </Stack>
      )}
    </>
  );
};

export const AdviseEnvironmentInfo = ({ runtime_environment, pipfile, pipfileLock }: IAdviseEnvironmentInfo) => {
  const [currentRuntimeEnvironment, setCurrentRuntimeEnvironment] = useState(runtime_environment);
  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  if (!runtime_environment) {
    return (
      <Box height="100vh" flexDirection="column" display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h5" align="center">
          Environment data not available
        </Typography>
        <Typography variant="body2" align="center">
          The advise document did not contain information regarding the runtime environment
        </Typography>
      </Box>
    );
  }

  const handleSubmit = (key: any, value: any, subKey?: any) => {
    setErrorMessage(undefined);
    if (currentRuntimeEnvironment) {
      if (subKey) {
        setCurrentRuntimeEnvironment({
          ...currentRuntimeEnvironment,
          [key]: {
            ...(currentRuntimeEnvironment[key as keyof typeof currentRuntimeEnvironment] as { [key: string]: any }),
            [subKey]: value === "" ? null : value,
          },
        });
      } else {
        setCurrentRuntimeEnvironment({
          ...currentRuntimeEnvironment,
          [key]: value === "" ? null : value,
        });
      }
    }
  };

  const data: ListData[] = useMemo(() => {
    return [
      {
        label: "Name",
        key: "name",
        original: runtime_environment.name,
        value: currentRuntimeEnvironment?.name,
        detail: "User defined name of the runtime environment",
      },
      {
        label: "CUDA Version",
        original: runtime_environment.cuda_version,
        value: currentRuntimeEnvironment?.cuda_version,
        key: "cuda_version",
        detail: "Nvidia CUDA version which the application uses",
      },
      {
        label: "cuDNN Version",
        original: runtime_environment.cudnn_version,
        value: currentRuntimeEnvironment?.cudnn_version,
        key: "cudnn_version",
        detail: "NVIDIA cuDNN version used, if any",
      },
      {
        label: "Hardware",
        key: "hardware",
        group: [
          {
            label: "CPU Family",
            original: runtime_environment.hardware?.cpu_family,
            value: currentRuntimeEnvironment?.hardware?.cpu_family,
            key: "cpu_family",
          },
          {
            label: "CPU Model",
            original: runtime_environment.hardware?.cpu_model,
            value: currentRuntimeEnvironment?.hardware?.cpu_model,
            key: "cpu_model",
          },
          {
            label: "GPU Model",
            original: runtime_environment.hardware?.gpu_model,
            value: currentRuntimeEnvironment?.hardware?.gpu_model,
            key: "gpu_model",
          },
        ],
        detail: "Hardware configuration used",
      },
      {
        label: "Math Kernel Library",
        original: runtime_environment.mkl_version,
        value: currentRuntimeEnvironment?.mkl_version,
        key: "mkl_version",
        detail: "Intel® Math Kernel Library version used, if any",
      },
      {
        label: "Base Image",
        original: runtime_environment.base_image,
        value: currentRuntimeEnvironment?.base_image,
        key: "base_image",
        detail: "A base container image used to run the application",
      },
      {
        label: "Open BLAS Version",
        original: runtime_environment.openblas_version,
        value: currentRuntimeEnvironment?.openblas_version,
        key: "openblas_version",
        detail: "Open BLAS version used, if any",
      },
      {
        label: "Open MPI Version",
        original: runtime_environment.openmpi_version,
        value: currentRuntimeEnvironment?.openmpi_version,
        key: "openmpi_version",
        detail: "Open MPI version used, if any",
      },
      {
        label: "Operating System",
        key: "operating_system",
        group: [
          {
            label: "OS Name",
            original: runtime_environment.operating_system?.name,
            value: currentRuntimeEnvironment?.operating_system?.name,
            key: "name",
          },
          {
            label: "OS Version",
            original: runtime_environment.operating_system?.version,
            value: currentRuntimeEnvironment?.operating_system?.version,
            key: "version",
          },
        ],
        detail: "Operating system used",
      },
      {
        label: "Platform",
        original: runtime_environment.platform,
        value: currentRuntimeEnvironment?.platform,
        key: "platform",
        detail: "Platform used - corresponds to sysconfig.get_platform() call",
      },
      {
        label: "Python Version",
        original: runtime_environment.python_version,
        value: currentRuntimeEnvironment?.python_version,
        key: "python_version",
        detail: "Python version on which the application runs on",
      },
    ];
  }, [runtime_environment, currentRuntimeEnvironment]);

  const formatted_json = useMemo(() => {
    const format: { [key: string]: any } = {};

    Object.entries(currentRuntimeEnvironment ?? {}).forEach(([key, value]) => {
      if (value) {
        if (typeof value === "object") {
          const formatObj: { [key: string]: any } = {};

          if (currentRuntimeEnvironment) {
            Object.entries(value).forEach(([subKey, subValue]) => {
              if (subValue) {
                formatObj[subKey] = subValue;
              }
            });
          }

          if (Object.keys(formatObj).length > 0) {
            format[key] = formatObj;
          }
        } else {
          format[key] = value;
        }
      }
    });

    return yaml.dump(format).toString();
  }, [currentRuntimeEnvironment]);

  const handleNewAdvise = () => {
    setErrorMessage(undefined);
    setLoading(true);
    postAdvise(pipfile, pipfileLock, currentRuntimeEnvironment as components["schemas"]["RuntimeEnvironment"])
      .then(response => {
        setLoading(false);
        navigate("/advise/" + response.data.analysis_id + "/summary");
      })
      .catch(error => {
        setLoading(false);
        setErrorMessage(error?.response?.data?.error ?? "An error occurred.");
      });
  };

  const getIcon = (item: ListData) => {
    let mode: string;
    if (item.group) {
      if (item.group.some(subItem => subItem.original !== subItem.value)) {
        mode = "warning";
      } else if (item.group.every(subItem => !subItem.original)) {
        mode = "error";
      } else {
        mode = "success";
      }
    } else {
      if (item.original !== item.value) {
        mode = "warning";
      } else if (!item.original) {
        mode = "error";
      } else {
        mode = "success";
      }
    }

    switch (mode) {
      case "warning":
        return <ChangeHistoryRoundedIcon color="warning" />;
      case "error":
        return <CloseRoundedIcon color="error" />;
      case "success":
        return <DoneRoundedIcon color="success" />;
    }
  };

  return (
    <Box>
      <Typography variant="h4">Project Runtime Environment</Typography>
      <Typography variant="body1">
        Thoth performs recommendations based on your hardware and software environment.
      </Typography>

      <Grid container alignItems="center" sx={{ marginLeft: 2, marginTop: 1, marginBottom: 2 }}>
        <Grid item>
          <DoneRoundedIcon color="success" sx={{ marginRight: 2, verticalAlign: "middle" }} />
        </Grid>
        <Grid item>
          <Typography variant="body2">
            <i>Value provided</i>
          </Typography>
        </Grid>

        <Grid item xs={12} />

        <Grid item>
          <CloseRoundedIcon color="error" sx={{ marginRight: 2, verticalAlign: "middle" }} />
        </Grid>
        <Grid item>
          <Typography variant="body2">
            <i>Value not provided</i>
          </Typography>
        </Grid>

        <Grid item xs={12} />

        <Grid item>
          {" "}
          <ChangeHistoryRoundedIcon color="warning" sx={{ marginRight: 2, verticalAlign: "middle" }} />
        </Grid>
        <Grid item>
          <Typography variant="body2">
            <i>Value edited</i>
          </Typography>
        </Grid>
      </Grid>

      <Divider />

      {data.some(item => {
        if (item.group) {
          return item.group.some(subItem => subItem.original !== subItem.value);
        } else {
          return item.original !== item.value;
        }
      }) ? (
        <Alert
          action={
            <Stack direction="row" spacing={1}>
              <Button
                disabled={loading}
                size="small"
                variant="outlined"
                onClick={() => {
                  setCurrentRuntimeEnvironment(runtime_environment);
                  setErrorMessage(undefined);
                }}
              >
                RESET PARAMETERS
              </Button>
              <LoadingButton loading={loading} size="small" variant="contained" onClick={() => handleNewAdvise()}>
                NEW ADVISE
              </LoadingButton>
            </Stack>
          }
          sx={{ marginTop: 2 }}
          variant="outlined"
          severity="warning"
        >
          The environment parameters are edited and are not equal to the parameters set in the adviser report. You can
          use the new environment parameters to run a new adviser report, or you can reset them back to the original
          values.
        </Alert>
      ) : undefined}

      {errorMessage ? (
        <Alert sx={{ marginTop: 2 }} variant="outlined" severity="error">
          {errorMessage}
        </Alert>
      ) : undefined}

      <Grid container spacing={4}>
        <Grid item xs={8}>
          <List dense>
            <ListItem>
              <ListItemAvatar />
              <ListItemText>
                <Typography variant="body1" fontWeight="bold">
                  Environment Parameters
                </Typography>
              </ListItemText>
              <Typography variant="body1" fontWeight="bold">
                Value
              </Typography>
              {editMode ? (
                <IconButton sx={{ marginLeft: 1 }} onClick={() => setEditMode(false)}>
                  <DoneRoundedIcon fontSize="small" />
                </IconButton>
              ) : (
                <IconButton sx={{ marginLeft: 1 }} onClick={() => setEditMode(true)}>
                  <EditRoundedIcon fontSize="small" />
                </IconButton>
              )}
            </ListItem>
            {data.map((item, i) => {
              return (
                <React.Fragment key={item.key + i}>
                  <ListItem>
                    <ListItemAvatar>{getIcon(item)}</ListItemAvatar>
                    <ListItemText primary={item.label} secondary={item.detail} />
                    {item.group ? (
                      <Stack spacing={1}>
                        {item.group.map(subItem => {
                          return (
                            <EditableLabel
                              key={item.key + subItem.key}
                              itemKey={item.key}
                              itemSubKey={subItem.key}
                              label={subItem.label}
                              value={
                                (
                                  currentRuntimeEnvironment?.[item.key as keyof typeof currentRuntimeEnvironment] as {
                                    [key: string]: any;
                                  }
                                )?.[subItem.key] ?? ""
                              }
                              handleSubmit={handleSubmit}
                              editMode={editMode}
                            />
                          );
                        })}
                      </Stack>
                    ) : (
                      <EditableLabel
                        label={item.label}
                        itemKey={item.key}
                        value={currentRuntimeEnvironment?.[item.key as keyof typeof currentRuntimeEnvironment] ?? ""}
                        handleSubmit={handleSubmit}
                        editMode={editMode}
                      />
                    )}
                  </ListItem>
                  <Divider variant="inset" />
                </React.Fragment>
              );
            })}
          </List>
        </Grid>
        <Grid item xs={4}>
          <Card sx={{ marginTop: 2 }} variant="outlined">
            <CardHeader
              title={currentRuntimeEnvironment?.name}
              action={
                <Button size="small" variant="outlined" onClick={() => navigator.clipboard.writeText(formatted_json)}>
                  COPY
                </Button>
              }
            />
            <CardContent>
              <pre>{formatted_json}</pre>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
