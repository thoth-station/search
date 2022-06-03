import React, { useContext, useState } from "react";

import { LicenseMetricType } from "hooks/metrics";
import {
    Box, Card, CardContent, CardHeader, Chip,
    Grid,
    List,
    ListItem,
    ListItemAvatar, ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import Loading from "components/Elements/Loading/Loading";
import { StateContext } from "stores/Global";

interface IAdviseLicenses {
    metric: LicenseMetricType | null
}

export function AdviseLicenses({ metric }: IAdviseLicenses) {
    const state = useContext(StateContext);
    const [selected, setSelected] = useState<string | undefined>()

    if(metric === null || Object.keys(metric).length === 0) {
        return (
            <Loading
                type="circular"
                label={state?.loading?.["graph"].text}
                progress={
                    ((state?.loading?.["graph"].value ?? 0) /
                        (state?.loading?.["graph"].total ?? 1)) *
                    100
                }
            />
        );
    }

    return (
        <Grid container spacing={4}>
            <Grid item xs={12}>
                <Typography variant="h4">Package Licenses</Typography>
                <Typography variant="body1">The Open Source Initiative (OSI) approves open source licenses
                    that allow software to be freely used, modified, and shared.</Typography>
            </Grid>
            <Grid item xs={6}>
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Typography fontWeight="bold" variant="body1">OSI</Typography>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography fontWeight="bold" variant="body1">License</Typography>
                        </ListItemText>
                        <Typography fontWeight="bold" variant="body1">Count</Typography>
                    </ListItem>
                    {Object.entries(metric).map(([name, data]) => {
                        return (
                            <ListItem key={name} selected={selected === name} disablePadding sx={{borderRadius: 100}}>
                                <ListItemButton onClick={() => setSelected(name)} sx={{borderRadius: 100}}>
                                    <ListItemAvatar>
                                        {data.metadata?.isOsiApproved === null ? (
                                            <HelpOutlineRoundedIcon color="info"/>
                                        ) : data.metadata?.isOsiApproved ? (
                                            <CheckRoundedIcon color="success"/>
                                        ) : null}
                                    </ListItemAvatar>
                                    <ListItemText>
                                        <Typography variant="body1">{name}</Typography>
                                    </ListItemText>
                                    <Chip label={Object.keys(data.packages).length} />
                                </ListItemButton>

                            </ListItem>
                        )
                    })}
                </List>
            </Grid>
            <Grid item xs={6}>
                {selected
                    ? (
                        <Card sx={{marginTop: 2}} variant="outlined">
                            <CardHeader
                                title={selected}
                                subheader={`Packages that use the ${selected}`}
                            />
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography variant="body1" fontWeight="bold">Package</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body1" fontWeight="bold">PyPI License</Typography>
                                    </Grid>
                                    {Object.entries(metric[selected].packages).map(([pkgName, pkgData]) => {
                                        return (
                                            <React.Fragment key={pkgName}>
                                                <Grid item xs={6}>
                                                    <Typography variant="body1">{pkgName}</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="body1">{pkgData.specific}</Typography>
                                                </Grid>
                                            </React.Fragment>
                                        )
                                    })}
                                </Grid>
                            </CardContent>
                        </Card>
                    )
                    : (
                        <Box
                            height="100%"
                            flexDirection="column"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                        >
                            <Typography variant="h5" align="center">
                                Choose a license
                            </Typography>
                            <Typography variant="body2" align="center">
                                Click on a license from the list of licenses to
                                view which packages use that license
                            </Typography>
                        </Box>
                    )
                }
            </Grid>
        </Grid>
    )

}
