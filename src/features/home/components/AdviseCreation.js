import {Button, Collapse, Grid, Paper, TextField, Typography} from "@material-ui/core";
import SearchBar from "components/Elements/SearchBar";
import React, {useReducer} from "react";
import {useNavigate} from "react-router-dom";
import LoadingButton from "@material-ui/lab/LoadingButton";
import {postAdvise} from "../api";
import ComboBox from "./ComboBox/ComboBox";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

function reducer(state, action) {
    switch (action.type) {
        case "loading":
            return {...state, loading: action.payload};
        case "error":
            return {...state, error: {...state.error, [action.param]: action.payload}};
        case "clear-error":
            state.error = {};
            return state;
        case "input":
            return {...state, [action.param]: action.payload, error: {...state.error, [action.param]: undefined}};
        default:
            throw new Error("Advise state dispatch error");
    }
}

export const initState = {
    error: {},
    loading: false,
    lookupType: "id",
    operating_system_name: "ubi",
    operating_system_version: "8",
    platform: "linux-x86_64",
    python_version: "3.6",
    cuda_version: "",
    cudnn_version: "",
    mkl_version: "",
    name: "",
    openblas_version: "",
    openmpi_version: "",
    base_image: ""
};


export const AdviseCreation = () => {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initState)


    const isValid = () =>{
        if(state.lookupType === "id") {
            if(!state.id || state.id === "") {
                dispatch({type: "error", param: "id", payload: "Field cant be empty"})
                return false
            }
        }
        else {
            let valid = true;
            if(!state.pipfile) {
                valid = false
                dispatch({type: "error", param: "pipfile", payload: "Field cant be empty"})
            }
            if(!state.pipfileLock) {
                valid = false
                dispatch({type: "error", param: "pipfileLock", payload: "Field cant be empty"})
            }
            if(!state.name) {
                valid = false
                dispatch({type: "error", param: "name", payload: "Field cant be empty"})
            }

            return valid
        }

        return true
    }

    const handleAnalyze = async () => {
        if(state.loading || !isValid()) { return; }

        if(state.lookupType === "id") {
            navigate( "/advise/" + state.id);
        }
        else {
            dispatch({type: "loading", payload: true});
            const runtime_environment = {
                operating_system: {
                    name: state.operating_system_name,
                    version: state.operating_system_version
                },
                platform: state.platform,
                python_version: state.python_version,
                base_image: state.base_image,
                cuda_version: state.cuda_version,
                cudnn_version: state.cudnn_version,
                mkl_version: state.mkl_version,
                name: state.name,
                openblas_version: state.openblas_version,
                openmpi_version: state.openmpi_version,
            }
            postAdvise(state.pipfile, state.pipfileLock, runtime_environment)
                .then(response => {
                    dispatch({type: "loading", payload: false});
                    navigate( "/advise/" + response.data.analysis_id);
                })
                .catch(error => {
                    dispatch({type: "loading", payload: false});
                    if (error?.response?.status === 400) {
                        if (error?.response?.data?.error.includes("Pipfile.lock")) {
                            dispatch({type: "error", param: "pipfileLock", payload: error?.response?.data?.error})
                        } else if (error?.response?.data?.error.includes("Pipfile")) {
                            dispatch({type: "error", param: "pipfile", payload: error?.response?.data?.error})
                        }
                    }
                });
        }
    }


    return(
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
                                    error={state.error?.id}
                                    onChange={e => dispatch({type: "input", param: "id", payload: e.target.value})}
                                    helpertext={"Analysis ID"}
                                    type="search"
                                    boxprops={{ mr: 2 }}
                                    lefticon={<SearchRoundedIcon />}
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
                    <Button onClick={() => dispatch({type: "input", param: "lookupType", payload: "manual"})}>New Advise</Button>
                </>
            </Collapse>

            <Collapse in={state.lookupType === "manual"}>
                <>
                    <Typography variant={"h6"} mt={3}>Advise Parameters</Typography>
                    <Paper sx={{backgroundColor: "white", padding: 3, marginBottom: 5}} variant="outlined">
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <SearchBar
                                    label={
                                        state.error?.pipfile ? state.error?.pipfile : "Pipfile contents"
                                    }
                                    onChange={e => dispatch({type: "input", param: "pipfile", payload: e.target.value})}
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
                                    onChange={e => dispatch({type: "input", param: "pipfileLock", payload: e.target.value})}
                                    error={state.error?.pipfileLock !== undefined}
                                    multiline
                                    rows={8}
                                />
                            </Grid>
                        </Grid>
                        <Grid container mt={4} spacing={2}>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField onChange={e => dispatch({type: "input", param: "base_image", payload: e.target.value})} value={state.base_image} sx={{minWidth: "100%"}} label="Base Image" required={false} helperText="A base container image used to run the application." error={state.error?.base_image} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <ComboBox setValue={e => dispatch({type: "input", param: "cuda_version", payload: e})} value={state.cuda_version} suggestions={["9.0"]} label="CUDA Version" required={false} help="Nvidia CUDA version which the application uses." error={state.error?.cuda_version}/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <ComboBox setValue={e => dispatch({type: "input", param: "cudnn_version", payload: e})} value={state.cudnn_version} suggestions={["8"]} label="cuDNN Version" required={false} help="NVIDIA cuDNN version used, if any." error={state.error?.cudnn_version}/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <ComboBox setValue={e => dispatch({type: "input", param: "mkl_version", payload: e})} value={state.mkl_version} suggestions={["2021.1.1"]} label="MKL Version" required={false} help="Intel® Math Kernel Library version used, if any." error={state.error?.mkl_version}/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <ComboBox setValue={e => dispatch({type: "input", param: "name", payload: e})} value={state.name} suggestions={["ubi:8-prod"]} label="Name" required={true} help="User defined name of the runtime environment." error={state.error?.name}/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <ComboBox setValue={e => dispatch({type: "input", param: "openblas_version", payload: e})} value={state.openblas_version} suggestions={["0.3.13"]} label="OpenBLAS Version" required={false} help="OpenBLAS version used, if any." error={state.error?.openblas_version}/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <ComboBox setValue={e => dispatch({type: "input", param: "openmpi_version", payload: e})} value={state.openmpi_version} suggestions={["4.1"]} label="Open MPI Version" required={false} help="Open MPI version used, if any." error={state.error?.openmpi_version}/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField onChange={e => dispatch({type: "input", param: "operating_system_name", payload: e.target.value})} value={state.operating_system_name} sx={{minWidth: "100%"}} label="Operating System Name" required={false} helperText="Operating system name used." error={state.error?.operating_system_name}/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <TextField onChange={e => dispatch({type: "input", param: "operating_system_version", payload: e.target.value})} value={state.operating_system_version} sx={{minWidth: "100%"}} label="Operating System Version" required={false} helperText="Operating system version used." error={state.error?.operating_system_version}/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <ComboBox setValue={e => dispatch({type: "input", param: "platform", payload: e})} value={state.platform} suggestions={["linux-x86_64"]} label="Platform" required={false} help="Platform used - corresponds to sysconfig.get_platform() call." error={state.error?.platform}/>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <ComboBox setValue={e => dispatch({type: "input", param: "python_version", payload: e})} value={state.python_version} suggestions={["2.7", "3.6", "3.7", "3.8", "3.9"]} label="Python Version" required={false} help="Python version on which the application runs on." error={state.error?.python_version}/>
                            </Grid>
                            <Grid container item xs={12} spacing={2}>
                                <Grid item xs={6} md={6}>
                                    <LoadingButton
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => dispatch({type: "input", param: "lookupType", payload: "id"})}
                                        loading={state.loading}
                                        sx={{ minHeight: "100%", minWidth: "100%" }}
                                    >
                                        <b>Cancel</b>
                                    </LoadingButton>
                                </Grid>
                                <Grid item xs={6}>
                                    <LoadingButton
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleAnalyze()}
                                        loading={state.loading}
                                        sx={{ minHeight: "100%", minWidth: "100%" }}
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
    )
}