import { Button, Collapse, Grid, Typography } from "@mui/material";
import SearchBar from "components/Elements/SearchBar";
import React, { useMemo, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { postImageAnalyze, useContainerImages } from "../api";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GenericTable from "components/Elements/GenericTable/GenericTable";
import timeSince from "utils/timeSince";

interface ImageSearchState {
    error: { [key: string]: string | undefined };
    loading: boolean;
    lookupType: string;
    id: string;
}

function reducer(state: ImageSearchState, action: { [key: string]: any }) {
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
            throw new Error("Image state dispatch error");
    }
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
        id: "date",
        label: "Last Updated",
    },
];

const initState: ImageSearchState = {
    error: {},
    loading: false,
    lookupType: "id",
    id: "",
};

export const ImageSearch = () => {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initState);

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

    const tableRowAction = (row: {package_extract_document_id: string, environment_name: string}) => {
        navigate("/image/" + row.package_extract_document_id, {
            state: { image_name: row.environment_name },
        });
    };

    const handleAnalyze = async () => {
        if (state.loading) {
            return;
        }

        if (state.id.includes("package-extract")) {
            navigate("/image/" + state.id);
            return;
        }

        dispatch({ type: "loading", payload: true });

        postImageAnalyze(state.id)
            .then(response => {
                dispatch({ type: "loading", payload: false });
                navigate("/image/" + response.data.analysis_id, {
                    state: { image_name: state.id },
                });
            })
            .catch(error => {
                dispatch({ type: "loading", payload: false });
                if (error?.response?.status === 400) {
                    dispatch({
                        type: "error",
                        param: "id",
                        payload:
                            error?.response?.data?.error ??
                            "An unknown error occurred",
                    });
                }
            });
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
                                    error={state.error?.id != undefined}
                                    onChange={e =>
                                        dispatch({
                                            type: "input",
                                            param: "id",
                                            payload: e.target.value,
                                        })
                                    }
                                    helpertext={"Analysis ID or image name"}
                                    type="search"
                                    boxprops={{ mr: 2 }}
                                    lefticon={<SearchRoundedIcon />}
                                    onEnter={handleAnalyze}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAnalyze}
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
                                payload: "lookup",
                            })
                        }
                    >
                        Lookup Thoth Images
                    </Button>
                </>
            </Collapse>

            <Collapse in={state.lookupType === "lookup"}>
                <>
                    <Typography variant={"h6"} mt={3} mb={1} ml={2}>
                        Available Thoth Container Images
                    </Typography>
                    <GenericTable headers={headCells} rows={rows} action={tableRowAction} />
                </>
            </Collapse>
        </>
    );
};
