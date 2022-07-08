import { Button, Grid, Typography } from "@mui/material";
import SearchBar from "components/Elements/SearchBar";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPackageExists } from "../api";

export const PackageSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");

  const handleAnalyze = async () => {
    // if no query
    if (searchQuery === "") {
      return;
    }

    const exists = await getPackageExists(searchQuery);

    if (exists) {
      navigate("/package/" + searchQuery);
    } else {
      setSearchError("Thoth does not know about that package");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (searchError !== "") {
      setSearchError("");
    }
  };

  return (
    <Grid container justifyContent="center">
      <Grid alignSelf="flex-start" item xs={12}>
        <Typography color="error" variant="body1" sx={{ minHeight: 30 }}>
          {searchError ?? ""}
        </Typography>
      </Grid>
      <Grid container spacing={2} item xs={12}>
        <Grid item xs={12} md={10}>
          <SearchBar
            error={searchError !== ""}
            onChange={e => handleChange(e)}
            helpertext={"Search for a Python package"}
            type="search"
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
  );
};
