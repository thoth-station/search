import React, { useContext, useMemo, useState } from "react";

import { Chip, List, ListItem, ListItemSecondaryAction, ListItemText, Stack, Typography } from "@mui/material";

// local
import { SelectedPackageContext } from "../../routes/AdviseDetails";
import { Graph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";
import { PackageNodeValue } from "lib/interfaces/PackageNodeValue";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SearchBar from "components/Elements/SearchBar";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { useNavigate } from "react-router-dom";

interface IPackageList {
  graph?: Graph<Node<PackageNodeValue>>;
}

type PackageList = {
  name: string;
  key: string;
  summary?: string;
  version?: string;
  warnings: number;
  errors: number;
}[];

/**
 * The table cells and total structure specific to
 * python packages.
 */
export function PackageList({ graph }: IPackageList) {
  const navigate = useNavigate();

  const { selected, setSelected } = useContext(SelectedPackageContext) ?? {
    setSelected: () => console.log("missing callback"),
  };

  const [search, setSearch] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  // format data
  const packageList = useMemo(() => {
    if (!graph) {
      return [];
    }

    const packages: PackageList = [];
    graph.nodes.forEach(node => {
      if (node.value.depth === -1) {
        return;
      }
      packages.push({
        name: node.value.name ?? node.key,
        key: node.key,
        summary: node?.value?.metadata?.Summary ?? "",
        version: node?.value.version,
        warnings: node.value.justifications?.filter(j => j.type === "WARNING")?.length ?? 0,
        errors: node.value.justifications?.filter(j => j.type === "ERROR")?.length ?? 0,
      });
    });

    return packages;
  }, [graph]);

  if (!graph) {
    return null;
  }

  return (
    <Stack spacing={2} sx={{ maxHeight: "100%" }}>
      <SearchBar onChange={handleSearch} lefticon={<SearchRoundedIcon />} />
      <List sx={{ overflow: "scroll" }} dense>
        {packageList
          .filter(p => p.name.startsWith(search))
          .map(p => {
            return (
              <ListItem
                key={p.key}
                button
                onClick={() => {
                  setSelected(p.key);
                  navigate("../packages/" + p.key);
                }}
                selected={selected === p.key}
                // divider
                sx={{
                  borderRadius: 1.5,
                  // marginY: 0.5,
                  // backgroundColor:
                  //     selected === p.key
                  //         ? hexFromArgb(
                  //               activeColor.light
                  //                   .colorContainer,
                  //           )
                  //         : undefined,
                  // color:
                  //     selected === p.key
                  //         ? hexFromArgb(
                  //               activeColor.light
                  //                   .onColorContainer,
                  //           )
                  //         : undefined,
                }}
              >
                <ListItemText primary={<Typography variant="h5">{p.name}</Typography>} secondary={`v${p.version}`} />
                <ListItemSecondaryAction>
                  <Stack direction="row" spacing={1}>
                    {p.warnings ? (
                      <Chip
                        variant="outlined"
                        size="medium"
                        icon={<WarningAmberOutlinedIcon />}
                        label={p.warnings}
                        color="warning"
                      />
                    ) : undefined}
                    {p.errors ? (
                      <Chip
                        variant="outlined"
                        size="medium"
                        icon={<ErrorOutlineOutlinedIcon />}
                        label={p.errors}
                        color="error"
                      />
                    ) : undefined}
                  </Stack>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
      </List>
    </Stack>
  );
}
