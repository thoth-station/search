import {
    Button,
    Collapse,
    Grid,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import SearchBar from "components/Elements/SearchBar";
import React, { useMemo, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { postAdvise } from "../api";
import ComboBox from "./ComboBox/ComboBox";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { components } from "lib/schema";
import GenericTable from "../../../components/Elements/GenericTable/GenericTable";
import { useAdviseDocuments } from "../../advise/api";
import { LOCAL_STORAGE_KEY } from "../../../config";
import { calcTime } from "../../../utils/calcTime";

interface IAdviseState {
    error: { [key: string]: string | undefined };
    id?: string;
    pipfile?: string;
    pipfileLock?: string;
    loading: boolean;
    lookupType: string;
    operating_system_name: string;
    operating_system_version: string;
    python_version: string;
    cuda_version: string;
    cudnn_version: string;
    mkl_version: string;
    name: string;
    openblas_version: string;
    openmpi_version: string;
    base_image: string;
}

function reducer(state: IAdviseState, action: { [key: string]: any }) {
    switch (action.type) {
        case "loading":
            return { ...state, loading: action.payload };
        case "error":
            return {
                ...state,
                error: { ...state.error, [action.param]: action.payload },
            };
        case "clear-error":
            state.error = {};
            return state;
        case "input":
            return {
                ...state,
                [action.param]: action.payload,
                error: { ...state.error, [action.param]: undefined },
            };
        default:
            throw new Error("Advise state dispatch error");
    }
}

const headCells = [
    {
        id: "document_id",
        label: "Document ID",
    },
    {
        id: "status",
        label: "Status",
    },
    {
        id: "name",
        label: "Name",
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
        id: "date",
        label: "Last Run",
    },
];

export const initState: IAdviseState = {
    error: {},
    loading: false,
    lookupType: "id",
    operating_system_name: "ubi",
    operating_system_version: "8",
    python_version: "3.8",
    cuda_version: "",
    cudnn_version: "",
    mkl_version: "",
    name: "",
    openblas_version: "",
    openmpi_version: "",
    base_image: "",
};

export const AdviseCreation = () => {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initState);

    const localHistory: string[] = useMemo(() => {
        const ids = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (ids) {
            return ids.split(",").filter(s => s !== "");
        } else {
            return [];
        }
    }, []);

    const adviseHistory = useAdviseDocuments(localHistory);

    const rows = useMemo(() => {
        if (adviseHistory) {
            return adviseHistory.map(doc => {
                const status = () => {
                    if (doc.data?.data?.status) {
                        return doc.data?.data?.status.state;
                    } else if (doc.data?.data.result.report?.products) {
                        return "success";
                    } else {
                        return "error";
                    }
                };
                return {
                    document_id: doc.data?.data?.metadata?.document_id,
                    name: doc.data?.data?.result?.report?.products?.[0].project
                        .runtime_environment?.name,
                    os_name:
                        doc.data?.data?.result?.report?.products?.[0].project
                            .runtime_environment?.operating_system?.name,
                    os_version:
                        doc.data?.data?.result?.report?.products?.[0].project
                            .runtime_environment?.operating_system?.version,
                    python_version:
                        doc.data?.data?.result?.report?.products?.[0].project
                            .runtime_environment?.python_version,
                    status: status(),
                    date: calcTime(
                        doc.data?.data?.status?.finished_at,
                        doc.data?.data?.status?.started_at,
                        doc.data?.data?.metadata?.datetime,
                    ),
                };
            });
        } else {
            return [];
        }
    }, [adviseHistory]);

    const tableRowAction = (row: { document_id: string }) => {
        navigate("/advise/" + row.document_id);
    };

    const isValid = () => {
        if (state.lookupType === "id") {
            if (!state.id || state.id === "") {
                dispatch({
                    type: "error",
                    param: "id",
                    payload: "Field cant be empty",
                });
                return false;
            }
        } else {
            let valid = true;
            if (!state.pipfile) {
                valid = false;
                dispatch({
                    type: "error",
                    param: "pipfile",
                    payload: "Field cant be empty",
                });
            }
            if (!state.pipfileLock) {
                valid = false;
                dispatch({
                    type: "error",
                    param: "pipfileLock",
                    payload: "Field cant be empty",
                });
            }
            if (!state.name) {
                valid = false;
                dispatch({
                    type: "error",
                    param: "name",
                    payload: "Field cant be empty",
                });
            }

            return valid;
        }

        return true;
    };

    const handleAnalyze = async () => {
        if (state.loading || !isValid()) {
            return;
        }

        if (state.lookupType === "id") {
            navigate("/advise/" + state.id);
        } else {
            dispatch({ type: "loading", payload: true });
            const runtime_environment: components["schemas"]["RuntimeEnvironment"] =
                {
                    operating_system: {
                        name: state.operating_system_name,
                        version: state.operating_system_version,
                    },
                    python_version: state.python_version,
                    base_image: state.base_image,
                    cuda_version: state.cuda_version,
                    cudnn_version: state.cudnn_version,
                    mkl_version: state.mkl_version,
                    name: state.name,
                    openblas_version: state.openblas_version,
                    openmpi_version: state.openmpi_version,
                };

            (
                Object.keys(runtime_environment) as Array<
                    keyof typeof runtime_environment
                >
            ).forEach(key => {
                if (runtime_environment[key] === "") {
                    delete runtime_environment[key];
                }
            });
            if (
                runtime_environment?.["operating_system"]?.["name"] === "" ||
                runtime_environment?.["operating_system"]?.["version"] === ""
            ) {
                delete runtime_environment["operating_system"];
            }

            if (!state.pipfile) {
                dispatch({
                    type: "error",
                    param: "pipfile",
                    payload: "Pipfile is required",
                });
            } else if (!state.pipfileLock) {
                dispatch({
                    type: "error",
                    param: "pipfileLock",
                    payload: "Pipfile.lock is required",
                });
            } else {
                postAdvise(
                    state.pipfile,
                    state.pipfileLock,
                    runtime_environment,
                )
                    .then(response => {
                        dispatch({ type: "loading", payload: false });
                        navigate(
                            "/advise/" + response.data.analysis_id + "/summary",
                        );
                    })
                    .catch(error => {
                        dispatch({ type: "loading", payload: false });
                        if (error?.response?.status === 400) {
                            if (
                                error?.response?.data?.error?.includes(
                                    "Pipfile.lock",
                                )
                            ) {
                                dispatch({
                                    type: "error",
                                    param: "pipfileLock",
                                    payload: error?.response?.data?.error,
                                });
                            } else if (
                                error?.response?.data?.error?.includes(
                                    "Pipfile",
                                )
                            ) {
                                dispatch({
                                    type: "error",
                                    param: "pipfile",
                                    payload: error?.response?.data?.error,
                                });
                            }
                        }
                    });
            }
        }
    };

    return (
        <>
            <Collapse in={state.lookupType === "id"}>
                <>
                    <Grid container justifyContent="center">
                        <Grid item xs={12}>
                            <Typography
                                color="error"
                                variant="body1"
                                sx={{ minHeight: 30 }}
                            >
                                {state.error?.id}
                            </Typography>
                        </Grid>
                        <Grid container item xs={12} spacing={2}>
                            <Grid item xs={12} md={10}>
                                <SearchBar
                                    error={state.error?.id !== undefined}
                                    onChange={e =>
                                        dispatch({
                                            type: "input",
                                            param: "id",
                                            payload: e.target.value,
                                        })
                                    }
                                    helpertext={"Analysis ID"}
                                    type="search"
                                    boxprops={{ marginRight: 2 }}
                                    lefticon={<SearchRoundedIcon />}
                                    onEnter={handleAnalyze}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleAnalyze()}
                                    sx={{ minHeight: "100%", minWidth: "100%" }}
                                >
                                    <b>Analyze</b>
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Button
                        onClick={() =>
                            dispatch({
                                type: "input",
                                param: "lookupType",
                                payload: "manual",
                            })
                        }
                    >
                        New Advise
                    </Button>
                    <Button
                        onClick={() =>
                            dispatch({
                                type: "input",
                                param: "lookupType",
                                payload: "history",
                            })
                        }
                    >
                        History
                    </Button>
                </>
            </Collapse>

            <Collapse in={state.lookupType === "history"}>
                <>
                    <Typography variant={"h6"} mt={3} mb={1} ml={2}>
                        Local Thoth Advise History
                    </Typography>
                    <GenericTable
                        headers={headCells}
                        rows={rows}
                        action={tableRowAction}
                    />
                </>
            </Collapse>

            <Collapse in={state.lookupType === "manual"}>
                <>
                    <Typography variant={"h6"} mt={3} mb={1} ml={2}>
                        Advise Parameters
                    </Typography>
                    <Paper
                        sx={{
                            backgroundColor: "white",
                            padding: 3,
                            marginBottom: 5,
                        }}
                        variant="outlined"
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <SearchBar
                                    label={
                                        state.error?.pipfile
                                            ? state.error?.pipfile
                                            : "Pipfile contents"
                                    }
                                    onChange={e =>
                                        dispatch({
                                            type: "input",
                                            param: "pipfile",
                                            payload: e.target.value,
                                        })
                                    }
                                    error={state.error?.pipfile !== undefined}
                                    multiline
                                    rows={8}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <SearchBar
                                    label={
                                        state.error?.pipfileLock
                                            ? state.error?.pipfileLock
                                            : "Pipfile.lock contents"
                                    }
                                    onChange={e =>
                                        dispatch({
                                            type: "input",
                                            param: "pipfileLock",
                                            payload: e.target.value,
                                        })
                                    }
                                    error={
                                        state.error?.pipfileLock !== undefined
                                    }
                                    multiline
                                    rows={8}
                                />
                            </Grid>
                        </Grid>
                        <Grid container mt={4} spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    onChange={e =>
                                        dispatch({
                                            type: "input",
                                            param: "base_image",
                                            payload: e.target.value,
                                        })
                                    }
                                    value={state.base_image}
                                    sx={{ minWidth: "100%" }}
                                    label="Base Image"
                                    required={false}
                                    helperText="A base container image used to run the application."
                                    error={
                                        state.error?.base_image !== undefined
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <ComboBox
                                    setValue={e =>
                                        dispatch({
                                            type: "input",
                                            param: "cuda_version",
                                            payload: e?.title ?? "",
                                        })
                                    }
                                    value={state.cuda_version}
                                    suggestions={["9.0"]}
                                    label="CUDA Version"
                                    required={false}
                                    help="Nvidia CUDA version which the application uses."
                                    error={
                                        state.error?.cuda_version !== undefined
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <ComboBox
                                    setValue={e =>
                                        dispatch({
                                            type: "input",
                                            param: "cudnn_version",
                                            payload: e?.title ?? "",
                                        })
                                    }
                                    value={state.cudnn_version}
                                    suggestions={["8"]}
                                    label="cuDNN Version"
                                    required={false}
                                    help="NVIDIA cuDNN version used, if any."
                                    error={
                                        state.error?.cudnn_version !== undefined
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <ComboBox
                                    setValue={e =>
                                        dispatch({
                                            type: "input",
                                            param: "mkl_version",
                                            payload: e?.title ?? "",
                                        })
                                    }
                                    value={state.mkl_version}
                                    suggestions={["2021.1.1"]}
                                    label="MKL Version"
                                    required={false}
                                    help="Intel® Math Kernel Library version used, if any."
                                    error={
                                        state.error?.mkl_version !== undefined
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <ComboBox
                                    setValue={e =>
                                        dispatch({
                                            type: "input",
                                            param: "name",
                                            payload: e?.title ?? "",
                                        })
                                    }
                                    value={state.name}
                                    suggestions={["ubi:8-prod"]}
                                    label="Name"
                                    required={true}
                                    help="User defined name of the runtime environment."
                                    error={state.error?.name !== undefined}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <ComboBox
                                    setValue={e =>
                                        dispatch({
                                            type: "input",
                                            param: "openblas_version",
                                            payload: e?.title ?? "",
                                        })
                                    }
                                    value={state.openblas_version}
                                    suggestions={["0.3.13"]}
                                    label="OpenBLAS Version"
                                    required={false}
                                    help="OpenBLAS version used, if any."
                                    error={
                                        state.error?.openblas_version !==
                                        undefined
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <ComboBox
                                    setValue={e =>
                                        dispatch({
                                            type: "input",
                                            param: "openmpi_version",
                                            payload: e?.title ?? "",
                                        })
                                    }
                                    value={state.openmpi_version}
                                    suggestions={["4.1"]}
                                    label="Open MPI Version"
                                    required={false}
                                    help="Open MPI version used, if any."
                                    error={
                                        state.error?.openmpi_version !==
                                        undefined
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    onChange={e =>
                                        dispatch({
                                            type: "input",
                                            param: "operating_system_name",
                                            payload: e.target.value,
                                        })
                                    }
                                    value={state.operating_system_name}
                                    sx={{ minWidth: "100%" }}
                                    label="Operating System Name"
                                    required={false}
                                    helperText="Operating system name used."
                                    error={
                                        state.error?.operating_system_name !==
                                        undefined
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField
                                    onChange={e =>
                                        dispatch({
                                            type: "input",
                                            param: "operating_system_version",
                                            payload: e.target.value,
                                        })
                                    }
                                    value={state.operating_system_version}
                                    sx={{ minWidth: "100%" }}
                                    label="Operating System Version"
                                    required={false}
                                    helperText="Operating system version used."
                                    error={
                                        state.error
                                            ?.operating_system_version !==
                                        undefined
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <ComboBox
                                    setValue={e =>
                                        dispatch({
                                            type: "input",
                                            param: "python_version",
                                            payload: e?.title ?? "",
                                        })
                                    }
                                    value={state.python_version}
                                    suggestions={[
                                        "2.7",
                                        "3.6",
                                        "3.7",
                                        "3.8",
                                        "3.9",
                                    ]}
                                    label="Python Version"
                                    required={false}
                                    help="Python version on which the application runs on."
                                    error={
                                        state.error?.python_version !==
                                        undefined
                                    }
                                />
                            </Grid>
                            <Grid container item xs={12} spacing={2}>
                                <Grid item xs={6} md={6}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() =>
                                            dispatch({
                                                type: "input",
                                                param: "lookupType",
                                                payload: "id",
                                            })
                                        }
                                        sx={{
                                            minHeight: "100%",
                                            minWidth: "100%",
                                        }}
                                    >
                                        <b>Cancel</b>
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <LoadingButton
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleAnalyze()}
                                        loading={state.loading}
                                        sx={{
                                            minHeight: "100%",
                                            minWidth: "100%",
                                        }}
                                    >
                                        <b>Analyze</b>
                                    </LoadingButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </>
            </Collapse>
        </>
    );
};
