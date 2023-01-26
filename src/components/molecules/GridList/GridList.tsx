import React, { useState } from "react";
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemProps,
  ListItemText,
  ListItemTextProps,
} from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

export type GridListItemType = {
  title: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  expandedContent?: React.ReactNode;
};
interface IGridList {
  items: GridListItemType[];
  isButton?: boolean;
  primaryTypographyProps?: ListItemTextProps["primaryTypographyProps"];
  secondaryTypographyProps?: ListItemTextProps["secondaryTypographyProps"];
}
const GridList = ({ items, primaryTypographyProps, secondaryTypographyProps, isButton = false }: IGridList) => {
  const [selected, setSelected] = useState<number | undefined>();

  function ListItemCustom({ children, ...props }: ListItemButtonProps & ListItemProps & { children: React.ReactNode }) {
    if (isButton) {
      return <ListItemButton {...props}>{children}</ListItemButton>;
    } else {
      return (
        <ListItem disableGutters {...props}>
          {children}
        </ListItem>
      );
    }
  }

  return (
    <List dense>
      {items.map((row, i) => {
        return (
          <React.Fragment key={i}>
            <ListItemCustom
              selected={isButton && selected === i}
              secondaryAction={
                row.action ??
                (row.expandedContent ? (
                  <KeyboardArrowDown
                    sx={{
                      mr: -1,
                      transform: selected === i ? "rotate(0deg)" : "rotate(-90deg)",
                      transition: "0.2s",
                    }}
                  />
                ) : undefined)
              }
              key={i}
              sx={{ borderRadius: "16px" }}
              onClick={() => setSelected(selected === i ? undefined : i)}
            >
              {row.icon && <ListItemIcon>{row.icon}</ListItemIcon>}
              <ListItemText
                primaryTypographyProps={primaryTypographyProps}
                secondaryTypographyProps={secondaryTypographyProps}
                primary={row.title}
                secondary={row.subtitle}
              />
            </ListItemCustom>
            {row.expandedContent && <Collapse in={selected === i}>{row.expandedContent}</Collapse>}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default GridList;
