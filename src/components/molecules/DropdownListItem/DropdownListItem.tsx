import React, { useState } from "react";
import { Box, Collapse, Grid, IconButton, Stack, Typography } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

interface IDropdownListItem {
  title: string;
  children: JSX.Element;
  icon?: JSX.Element;
}

const DropdownListItem = ({ title, icon, children }: IDropdownListItem) => {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Grid
        container
        alignItems="center"
        sx={{
          backgroundColor: open ? "action.selected" : undefined,
          borderRadius: "16px",
        }}
      >
        <Grid item xs={11}>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={() => setOpen(!open)}>
              <KeyboardArrowDown
                sx={{
                  mr: -1,
                  transform: open ? "rotate(0deg)" : "rotate(-90deg)",
                  transition: "0.2s",
                }}
              />
            </IconButton>
            <Typography variant="body1" fontWeight="bolder">
              {title}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={1}>
          <Box display="flex" justifyContent="flex-end" sx={{ marginRight: 2 }}>
            {icon}
          </Box>
        </Grid>
      </Grid>
      <Collapse in={open}>{children}</Collapse>
    </Box>
  );
};

export default DropdownListItem;
