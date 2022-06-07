import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    Chip,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { KeyboardArrowDown } from "@mui/icons-material";

export const StackInfoInstallErrorMetric = ({
    url,
    metric,
}: {
    url: string;
    metric: (
        | { package: string; index: string; versions: string[] }
        | undefined
    )[];
}) => {
    const [selected, setSelected] = useState<number | undefined>();
    const theme = useTheme();
    const compact = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <>
            {compact ? (
                <Card variant="outlined">
                    <CardHeader
                        title="Installation Errors"
                        titleTypographyProps={{
                            variant: "h6",
                        }}
                        action={
                            <IconButton
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <OpenInNewRoundedIcon />
                            </IconButton>
                        }
                        avatar={
                            <Chip
                                icon={<ErrorOutlineOutlinedIcon />}
                                label={metric.reduce(
                                    (prev, cur) =>
                                        prev + (cur?.versions?.length ?? 0),
                                    0,
                                )}
                                color="error"
                            />
                        }
                    />
                </Card>
            ) : (
                <Card variant="outlined">
                    <CardHeader
                        title="Installation Errors"
                        subheader="The given package & version combinations were removed from the resolution process as they produced errors during installation in the given environment"
                        action={
                            <IconButton
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <OpenInNewRoundedIcon />
                            </IconButton>
                        }
                    />
                    <CardContent>
                        <List dense>
                            {metric.map((pkg, i) => {
                                return (
                                    <React.Fragment
                                        key={
                                            (pkg?.package ?? "") +
                                            (pkg?.index ?? "") +
                                            i
                                        }
                                    >
                                        <ListItem
                                            selected={selected === i}
                                            secondaryAction={
                                                <KeyboardArrowDown
                                                    sx={{
                                                        mr: -1,
                                                        transform:
                                                            selected === i
                                                                ? "rotate(0deg)"
                                                                : "rotate(-90deg)",
                                                        transition: "0.2s",
                                                    }}
                                                />
                                            }
                                            key={
                                                (pkg?.package ?? "") +
                                                (pkg?.index ?? "")
                                            }
                                            button
                                            sx={{ borderRadius: "16px" }}
                                            onClick={() =>
                                                setSelected(
                                                    selected === i
                                                        ? undefined
                                                        : i,
                                                )
                                            }
                                        >
                                            <ListItemIcon>
                                                <Chip
                                                    label={pkg?.versions.length}
                                                    color="error"
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={pkg?.package}
                                                secondary={pkg?.index}
                                            />
                                        </ListItem>
                                        <Collapse in={selected === i}>
                                            <ListItem>
                                                <ListItemText
                                                    inset
                                                    secondary={metric[
                                                        i
                                                    ]?.versions.join(", ")}
                                                />
                                            </ListItem>
                                        </Collapse>
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    </CardContent>
                </Card>
            )}
        </>
    );
};
