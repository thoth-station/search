import React from "react";

import { Box, Link, Paper, Stack, Typography } from "@mui/material";
import logo from "assets/footer-logo.png";

export const Footer = () => {
    return (
        <Paper
            variant="outlined"
            sx={{ padding: 4, marginTop: 10, marginBottom: 5 }}
        >
            <Box display="flex" justifyContent="center" alignItems="flex-start">
                <img
                    style={{ paddingLeft: 2, paddingRight: 2, height: "40px" }}
                    alt="Red Hat Sponsor Logo"
                    src={logo}
                />
                <Stack sx={{ paddingX: 2 }}>
                    <Typography
                        sx={{
                            textTransform: " uppercase",
                            paddingBottom: "20px",
                        }}
                        variant="h6"
                    >
                        Useful links
                    </Typography>

                    <Link
                        underline="hover"
                        sx={{ paddingBottom: 1 }}
                        href="https://github.com/orgs/thoth-station/projects/"
                    >
                        GitHub project board
                    </Link>
                    <Link
                        underline="hover"
                        sx={{ paddingBottom: 1 }}
                        href="http://bit.ly/thoth-on-youtube"
                    >
                        YouTube channel
                    </Link>

                    <Link
                        underline="hover"
                        sx={{ paddingBottom: 1 }}
                        href="https://twitter.com/ThothStation"
                    >
                        Twitter
                    </Link>

                    <Link
                        underline="hover"
                        sx={{ paddingBottom: 1 }}
                        href="https://github.com/thoth-station"
                    >
                        GitHub organization
                    </Link>

                    <Link
                        underline="hover"
                        sx={{ paddingBottom: 1 }}
                        href="https://www.kaggle.com/thothstation"
                    >
                        Kaggle datasets
                    </Link>
                </Stack>

                <Stack sx={{ paddingX: 2 }}>
                    <Typography
                        sx={{
                            textTransform: " uppercase",
                            paddingBottom: "20px",
                        }}
                        variant="h6"
                    >
                        Info
                    </Typography>

                    <Link
                        underline="hover"
                        sx={{ paddingBottom: 1 }}
                        href="https://thoth-station.ninja/docs/developers/adviser/landing_page.html#landing-page"
                    >
                        Thoth&apos;s landing page
                    </Link>

                    <Link
                        underline="hover"
                        sx={{ paddingBottom: 1 }}
                        href="https://thoth-station.ninja/docs/developers/adviser/"
                    >
                        Main documentation page
                    </Link>
                </Stack>

                <Stack sx={{ paddingX: 2 }}>
                    <Typography
                        sx={{
                            textTransform: " uppercase",
                            paddingBottom: "20px",
                        }}
                        variant="h6"
                    >
                        Friends
                    </Typography>

                    <Link
                        underline="hover"
                        sx={{ paddingBottom: 1 }}
                        href="https://github.com/AICoE/aicoe-ci"
                    >
                        AICoE-CI
                    </Link>

                    <Link
                        underline="hover"
                        sx={{ paddingBottom: 1 }}
                        href="https://www.operate-first.cloud/"
                    >
                        Operate First
                    </Link>

                    <Link
                        underline="hover"
                        sx={{ paddingBottom: 1 }}
                        href="http://opendatahub.io/"
                    >
                        Open Data Hub
                    </Link>
                </Stack>
            </Box>
        </Paper>
    );
};
