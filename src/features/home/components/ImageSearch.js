import { Button, Collapse, Grid, Typography } from "@mui/material";
import SearchBar from "components/Elements/SearchBar";
import React, { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { postImageAnalyze } from "../api";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ImageTable from "./ImageTable";

function reducer(state, action) {
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

export const initState = {
    error: {},
    loading: false,
    lookupType: "id",
    id: "",
};

export const ImageSearch = () => {
    const navigate = useNavigate();
    const [state, dispatch] = useReducer(reducer, initState);

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
                                    error={state.error?.id}
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
                    <ImageTable handleAnalyze={handleAnalyze} />
                </>
            </Collapse>
        </>
    );
};
