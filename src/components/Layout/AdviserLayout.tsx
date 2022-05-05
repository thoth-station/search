import * as React from "react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AutoAwesomeMosaicRoundedIcon from "@mui/icons-material/AutoAwesomeMosaicRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import { useMemo } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

const drawerWidth = 360;

interface IProps {
    children: React.ReactNode;
    chipData: {
        [key: string]: {
            info: number;
            warning: number;
            error: number;
        };
    };
}

interface ICustomListItem {
    label: string;
    to: string;
    icon?: React.ReactNode;
    selected: boolean;
    chipData?: {
        info: number;
        warning: number;
        error: number;
    };
    disabled?: boolean;
}

const CustomListItem = ({
    label,
    to,
    selected = false,
    icon,
    chipData,
    disabled,
}: ICustomListItem) => {
    return (
        <ListItem
            sx={{
                borderRadius: 100,
                height: 48,
                paddingLeft: 2,
                paddingRight: 3,
                marginRight: 1.5,
                backgroundColor: selected
                    ? "secondaryContainer.main"
                    : undefined,
            }}
            button
            disabled={disabled}
            component={RouterLink}
            to={to}
            secondaryAction={
                chipData ? (
                    <Stack direction="row" spacing={1}>
                        {chipData.info ? (
                            <Chip
                                variant="outlined"
                                size="small"
                                icon={<InfoOutlinedIcon />}
                                label={chipData.info}
                                color="info"
                            />
                        ) : undefined}
                        {chipData.warning ? (
                            <Chip
                                variant="outlined"
                                size="small"
                                icon={<WarningAmberOutlinedIcon />}
                                label={chipData.warning}
                                color="warning"
                            />
                        ) : undefined}
                        {chipData.error ? (
                            <Chip
                                variant="outlined"
                                size="small"
                                icon={<ErrorOutlineOutlinedIcon />}
                                label={chipData.error}
                                color="error"
                            />
                        ) : undefined}
                    </Stack>
                ) : undefined
            }
        >
            {icon ? (
                <ListItemIcon sx={{ minWidth: 3, marginRight: 1.5 }}>
                    {icon}
                </ListItemIcon>
            ) : undefined}
            <ListItemText
                disableTypography
                sx={{ marginLeft: icon ? undefined : 4.5 }}
            >
                <Typography
                    sx={{
                        color: selected
                            ? "secondaryContainer.contrast_text"
                            : "surface.contrastText",
                    }}
                    fontWeight="600"
                    variant="body2"
                >
                    {label}
                </Typography>
            </ListItemText>
        </ListItem>
    );
};

export const AdviserLayout = ({ children, chipData }: IProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const currentTab = useMemo(() => {
        return location.pathname.split("/").at(-1);
    }, [location.pathname]);

    return (
        <Box sx={{ display: "flex" }}>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Typography
                    component={Button}
                    onClick={() => navigate("/")}
                    variant="h5"
                    sx={{
                        color: "primary.main",
                        marginLeft: 3,
                        marginBottom: 1,
                        marginTop: 3,
                        width: "fit-content",
                    }}
                >
                    SEARCH UI
                </Typography>
                <List sx={{ paddingLeft: 1, paddingRight: 1.5 }}>
                    <CustomListItem
                        selected={currentTab === "summary"}
                        label="Summary"
                        to="summary"
                        icon={<AutoAwesomeMosaicRoundedIcon />}
                    />
                    <CustomListItem
                        label="Justifications"
                        to="justifications"
                        selected={currentTab === "justifications"}
                        icon={<ArticleRoundedIcon />}
                    />
                    <CustomListItem
                        label="Compare"
                        to="compare"
                        selected={currentTab === "compare"}
                        icon={<CompareArrowsRoundedIcon />}
                    />
                    <CustomListItem
                        label="Logs"
                        to="logs"
                        selected={currentTab === "logs"}
                        icon={<TerminalRoundedIcon />}
                    />
                </List>
                <Divider />
                <List sx={{ paddingLeft: 1, paddingRight: 1.5 }}>
                    <CustomListItem
                        disabled
                        label="Environment"
                        to="environment"
                        icon={<CircleRoundedIcon />}
                        selected={currentTab === "environment"}
                    />
                    <CustomListItem
                        disabled
                        label="Licenses"
                        to="licenses"
                        icon={<CircleRoundedIcon />}
                        selected={currentTab === "licenses"}
                    />
                    <CustomListItem
                        disabled
                        label="Dependency Tree"
                        to="dependency-tree"
                        icon={<CircleRoundedIcon />}
                        selected={currentTab === "dependency-tree"}
                    />
                    <CustomListItem
                        label="Stack Info"
                        to="stack-info"
                        icon={<CircleRoundedIcon />}
                        selected={currentTab === "stack-info"}
                        chipData={chipData["stack-info"]}
                    />
                </List>
            </Drawer>
            <Box sx={{ width: "100%", overflowX: "hidden" }}>{children}</Box>
        </Box>
    );
};
