import {Button, Grid, Typography} from "@material-ui/core";
import SearchBar from "../../../components/Elements/SearchBar";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import React, {useState} from "react";
import {getPackageMetadataPyPi} from "../../misc/api";
import {useNavigate} from "react-router-dom";

export const PackageSearch = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchError, setSearchError] = useState("");


    const handleAnalyze = async () => {
        // if no query
        if (searchQuery === "") {
            return;
        }

        getPackageMetadataPyPi(searchQuery)
            .then(response => {
                navigate("/package/" + response.data.info.name);
            })
            .catch(() => {
                setSearchError("Package does not exist");
            });
    }

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
        if (searchError !== "") {
            setSearchError("");
        }
    };

    return(

            <Grid container>
                <Grid item xs={10}>
                    <Typography
                        color="error"
                        variant="body1"
                        sx={{ minHeight: 30 }}
                    >
                        {searchError ?? ""}
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    <SearchBar
                        error={searchError !== ""}
                        onChange={e => handleChange(e)}
                        helpertext={"Search for a Python package"}
                        type="search"
                        boxprops={{ mr: 2 }}
                        lefticon={<SearchRoundedIcon />}
                    />
                </Grid>
                <Grid item sm={10} lg={1} ml={2}>
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
    )
}