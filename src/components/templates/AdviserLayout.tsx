import * as React from "react";
import { Box, Button, Chip, CSSObject, IconButton, Stack, styled, Theme, Typography } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
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
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MenuOpenRoundedIcon from "@mui/icons-material/MenuOpenRounded";
import { hexFromArgb } from "@material/material-color-utilities";

import { activeColor } from "styles/Theme";
import { useSidebarTotals } from "hooks/useSidebarTotals";

const drawerWidth = 360;

interface IProps {
  children: React.ReactNode;
  analysis_id: string;
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
  open: boolean;
  hideOnClosed?: boolean;
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: "80px",
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const CustomListItem = ({
  label,
  to,
  selected = false,
  icon,
  chipData,
  disabled,
  open,
  hideOnClosed,
}: ICustomListItem) => {
  if (!open && hideOnClosed) {
    return null;
  }

  return (
    <ListItem
      sx={{
        borderRadius: 100,
        height: 48,
        paddingLeft: 3,
        paddingRight: 3,
        marginRight: 1.5,
        marginY: 0.5,
        justifyContent: !open ? "center" : undefined,
        backgroundColor: selected ? hexFromArgb(activeColor.light.colorContainer) : undefined,
        color: selected ? hexFromArgb(activeColor.light.onColorContainer) : undefined,
      }}
      button
      disabled={disabled}
      component={RouterLink}
      to={to}
      secondaryAction={
        chipData && open ? (
          <Stack direction="row" spacing={1}>
            {chipData.info ? (
              <Chip variant="outlined" size="small" icon={<InfoOutlinedIcon />} label={chipData.info} color="info" />
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
        <ListItemIcon
          sx={{
            minWidth: 3,
            marginRight: open ? 1.5 : 0,
            color: selected ? hexFromArgb(activeColor.light.onColorContainer) : undefined,
          }}
        >
          {icon}
        </ListItemIcon>
      ) : undefined}
      {open ? (
        <ListItemText disableTypography sx={{ marginLeft: icon ? undefined : 4.5 }}>
          <Typography fontWeight="600" variant="body2">
            {label}
          </Typography>
        </ListItemText>
      ) : undefined}
    </ListItem>
  );
};

export const AdviserLayout = ({ children, analysis_id }: IProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: chipData } = useSidebarTotals(analysis_id);

  const [open, setOpen] = React.useState(false);

  const currentTab = useMemo(() => {
    return location.pathname.split("/").at(3);
  }, [location.pathname]);

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer open={open} variant="permanent">
        {open ? (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              marginBottom: 1,
              marginTop: 3,
              paddingRight: 1.5,
            }}
          >
            <Typography
              component={Button}
              onClick={() => navigate("/")}
              variant="h5"
              sx={{
                textAlign: "center",
                color: "primary.main",
                marginLeft: 3,
                width: "fit-content",
              }}
            >
              SEARCH UI
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <MenuOpenRoundedIcon />
            </IconButton>
          </Stack>
        ) : (
          <Box
            sx={{
              marginBottom: 1,
              marginTop: 3,
              textAlign: "center",
            }}
          >
            <IconButton onClick={() => setOpen(true)}>
              <MenuRoundedIcon />
            </IconButton>
          </Box>
        )}
        <List sx={{ paddingLeft: 1.5, paddingRight: 1.5 }}>
          <CustomListItem
            selected={currentTab === "summary"}
            label="Summary"
            to="summary"
            icon={<AutoAwesomeMosaicRoundedIcon />}
            open={open}
          />
          <CustomListItem
            label="Packages"
            to="packages"
            selected={currentTab === "packages"}
            icon={<ArticleRoundedIcon />}
            open={open}
          />
          <CustomListItem
            label="Compare"
            to="compare"
            selected={currentTab === "compare"}
            icon={<CompareArrowsRoundedIcon />}
            open={open}
          />
          <CustomListItem
            label="Logs"
            to="logs"
            selected={currentTab === "logs"}
            icon={<TerminalRoundedIcon />}
            open={open}
          />
        </List>
        {open ? <Divider /> : undefined}
        <List sx={{ paddingLeft: 1, paddingRight: 1.5 }}>
          <CustomListItem
            label="Environment"
            to="environment"
            icon={<CircleRoundedIcon />}
            selected={currentTab === "environment"}
            open={open}
            hideOnClosed
          />
          <CustomListItem
            label="Licenses"
            to="licenses"
            chipData={chipData?.["licenses"]}
            icon={<CircleRoundedIcon />}
            selected={currentTab === "licenses"}
            open={open}
            hideOnClosed
          />
          <CustomListItem
            label="Dependency Tree"
            to="dependency-tree"
            icon={<CircleRoundedIcon />}
            selected={currentTab === "dependency-tree"}
            open={open}
            hideOnClosed
          />
          <CustomListItem
            label="Stack Info"
            to="stack-info"
            icon={<CircleRoundedIcon />}
            selected={currentTab === "stack-info"}
            chipData={chipData?.["stack-info"]}
            open={open}
            hideOnClosed
          />
        </List>
      </Drawer>
      <Box sx={{ width: "100%", overflowX: "hidden" }}>{children}</Box>
    </Box>
  );
};
