import {Box, Grid} from "@material-ui/core";
import SearchBar from "../../../components/Elements/SearchBar";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import LoadingButton from "@material-ui/lab/LoadingButton";
import {postAdvise} from "../api";

export const AdviseCreation = () => {
    const navigate = useNavigate();

    // textbox states
    const [pipfileQuery, setPipfileQuery] = useState("");
    const [pipfileLockQuery, setPipfileLockQuery] = useState("");

    // textbox errors
    const [pipfileError, setPipfileError] = useState("");
    const [pipfileLockError, setPipfileLockError] = useState("");

    const [queryLoading, setQueryLoading] = useState(false);

    const handleAnalyze = async () => {
        // if no query
        if(
            pipfileQuery === "" ||
            pipfileLockQuery === "" ||
            pipfileError !== "" ||
            pipfileLockError !== ""
        ) {
            return;
        }

        let fail = false;
        if (!pipfileQuery) {
            fail = true;
            setPipfileError("Please provide a Pipfile");
        }
        if (!pipfileLockQuery) {
            fail = true;
            setPipfileLockError("Please provide a Pipfile.lock");
        }

        // if able to parse both
        if (!fail) {
            setQueryLoading(true);
            postAdvise(pipfileQuery, pipfileLockQuery)
                .then(response => {
                    setQueryLoading(false);
                    navigate( "/advise/" + response.data.analysis_id);
                })
                .catch(error => {
                    setQueryLoading(false);
                    if (error?.response?.status === 400) {
                        if (error?.response?.data?.error.includes("Pipfile.lock")) {
                            setPipfileLockError("Failed to parse provided Pipfile.lock");
                        } else if (error?.response?.data?.error.includes("Pipfile")) {
                            setPipfileError("Failed to parse provided Pipfile");
                        }
                    }
                });
        }
    }



    const handleChange = (e, box) => {
        if(box === "pipfile") {
            setPipfileQuery(e.target.value);
            if (pipfileError !== "") {
                setPipfileError("");
            }
        }
        else if(box === "lock") {
            setPipfileLockQuery(e.target.value);
            if (pipfileLockError !== "") {
                setPipfileLockError("");
            }
        }
    };

    return(
        <>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <SearchBar
                        label={
                            pipfileError !== "" ? pipfileError : "Pipfile contents"
                        }
                        onChange={e => handleChange(e, "pipfile")}
                        error={pipfileError !== ""}
                        multiline
                        rows={8}
                    />
                </Grid>
                <Grid item xs={6}>
                    <SearchBar
                        label={
                            pipfileLockError !== ""
                                ? pipfileLockError
                                : "Pipfile.lock contents"
                        }
                        onChange={e => handleChange(e, "lock")}
                        error={pipfileLockError !== ""}
                        multiline
                        rows={8}
                    />
                </Grid>
            </Grid>

            <Box textAlign="center" mt={2}>
                <LoadingButton
                    variant="contained"
                    color="primary"
                    onClick={() => handleAnalyze()}
                    loading={queryLoading}
                    sx={{ minHeight: "100%", minWidth: "100%" }}
                >
                    <b>Analyze</b>
                </LoadingButton>
            </Box>
        </>
    )
}