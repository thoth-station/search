import React, { useEffect, useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { Node } from "lib/interfaces/Node";
import { fromBytes } from "utils/fromBytes";
import { GavelRounded, KeyboardArrowDownRounded, KeyboardDoubleArrowDownRounded } from "@mui/icons-material";
import { useGraph } from "hooks";
import DependencyGraph from "components/organisms/DependencyGraph";
import { PackageVersionValue } from "lib/interfaces/PackageVersionValue";
import { usePackagesData } from "hooks/usePackageData";

export function AdviseDependencies({ analysis_id }: { analysis_id: string }) {
  const [selected, setSelected] = useState<Node<PackageVersionValue>>();
  const [dependents, setDependents] = useState<Node<PackageVersionValue>[]>([]);
  const [dependencies, setDependencies] = useState<Node<PackageVersionValue>[]>([]);

  const { data: graph } = useGraph(analysis_id);
  const {
    data: { packagesDataMap },
  } = usePackagesData(analysis_id);

  useEffect(() => {
    if (graph) {
      const root = graph.nodes.get("*App");
      if (root) {
        setSelected(root);
      }
    }
  }, [graph]);

  useEffect(() => {
    if (graph && selected) {
      setDependents(
        Array.from(selected?.parents.values() ?? []).map(key => graph.nodes.get(key)) as Node<PackageVersionValue>[],
      );
      setDependencies(Array.from(selected?.adjacents.values() ?? []));
    }
  }, [selected, graph]);

  const [agg_size, agg_license, agg_warnings, direct_deps, indirect_deps] = useMemo(() => {
    if (graph && selected) {
      let size = 0;
      const licenses: { [key: string]: number } = {};
      let warnings = 0;
      let direct = 0;
      let indirect = 0;

      const bfs = graph.graphSearch(selected);
      Array.from(bfs).forEach(node => {
        const nodeData = packagesDataMap?.get(node.key);
        if (nodeData) {
          size += nodeData.size ?? 0;
          warnings += nodeData.warningsCount ?? 0;
          if (licenses[nodeData?.license ?? "Not found"]) {
            licenses[nodeData?.license ?? "Not found"] += 1;
          } else {
            licenses[nodeData?.license ?? "Not found"] = 1;
          }

          // deps
          if (dependencies?.some(pkg => pkg.key === node.key)) {
            direct += 1;
          } else if (node.key !== selected.key) {
            indirect += 1;
          }
        }
      });

      return [size, licenses, warnings, direct, indirect];
    }

    return [0, [], 0, 0, 0];
  }, [selected]);

  return (
    <Grid container columnSpacing={4} rowSpacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Dependency Tree</Typography>
        <Typography variant="body1">
          A Python environment&apos;s packages can be organized as a one directional graph with root packages generally
          being the dependencies defined in the Pipfile.
        </Typography>
      </Grid>
      <Grid item xs={6} sx={{ marginTop: 1 }}>
        <List>
          {dependents?.length > 0 && dependents.at(0)?.key !== "*App" && (
            <ListItem sx={{ paddingBottom: 0 }}>
              <ListItemText>
                <Typography variant="body2" fontWeight="bold" sx={{ color: "gray" }}>
                  Dependents
                </Typography>
              </ListItemText>
            </ListItem>
          )}
          {dependents.map(node => {
            return (
              <ListItemButton key={node.key} onClick={() => setSelected(node)} sx={{ borderRadius: 100 }}>
                <ListItemAvatar>
                  <ArrowUpwardRoundedIcon />
                </ListItemAvatar>
                <ListItemText>
                  {selected?.key === "*App" && node.key === "*App" ? (
                    <Typography variant="body1" sx={{ color: "gray" }} fontStyle="italic">
                      Pipfile
                    </Typography>
                  ) : node.key === "*App" ? (
                    <Typography variant="body1" sx={{ color: "gray" }} fontStyle="italic">
                      Back to roots
                    </Typography>
                  ) : (
                    <Typography variant="body1">{node?.key}</Typography>
                  )}
                </ListItemText>
              </ListItemButton>
            );
          })}
          <ListItemButton selected sx={{ borderRadius: 100 }}>
            <ListItemText>
              {selected?.key === "*App" ? (
                <Typography variant="body1" sx={{ color: "gray" }} fontStyle="italic">
                  Pipfile
                </Typography>
              ) : (
                <Typography variant="body1">{selected?.key}</Typography>
              )}
            </ListItemText>
            <Chip sx={{ fontStyle: "italic" }} label="Selected" />
          </ListItemButton>
          {dependencies.length > 0 && (
            <ListItem sx={{ paddingBottom: 0 }}>
              <ListItemText>
                <Typography variant="body2" fontWeight="bold" sx={{ color: "gray" }}>
                  Dependencies
                </Typography>
              </ListItemText>
              <Typography variant="body2" fontWeight="bold" sx={{ color: "gray" }}>
                Dependency count
              </Typography>
            </ListItem>
          )}
          {dependencies.map(node => {
            return (
              <ListItemButton key={node.key} onClick={() => setSelected(node)} sx={{ borderRadius: 100 }}>
                <ListItemText>
                  <Typography variant="body1">{node?.key}</Typography>
                </ListItemText>
                <Chip label={node.adjacents.size} />
              </ListItemButton>
            );
          })}
        </List>
      </Grid>
      <Grid item xs={6}>
        <Card>
          {selected?.key === "*App" ? (
            <CardHeader
              title={"Pipfile"}
              subheader={`The supplied Pipfile has ${selected?.adjacents.size} dependencies`}
            />
          ) : (
            <CardHeader
              title={selected?.key}
              subheader={`${selected?.key} depends on ${selected?.adjacents.size} packages and is a dependency for ${selected?.parents.size}`}
            />
          )}
          <CardContent>
            {selected?.key !== "*App" && (
              <>
                <DependencyGraph analysis_id={analysis_id} graphHeight="25vh" root={selected?.key} />
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                  Package Stats
                </Typography>
                <Stack sx={{ marginLeft: 1 }} spacing={1.5}>
                  <Stack direction="row" spacing={1}>
                    <DescriptionRoundedIcon />
                    <Typography variant="body1" fontWeight="bold">
                      Package size:{" "}
                    </Typography>
                    <Typography variant="body1">
                      {fromBytes(packagesDataMap?.get(selected?.key ?? "")?.size ?? 0)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <WarningAmberOutlinedIcon color="warning" />
                    <Typography variant="body1" fontWeight="bold">
                      Package warnings count:{" "}
                    </Typography>
                    <Typography variant="body1">
                      {packagesDataMap?.get(selected?.key ?? "")?.warningsCount ?? 0}
                    </Typography>
                  </Stack>
                </Stack>
                <Divider sx={{ marginY: 2 }} variant="fullWidth" />
              </>
            )}

            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Dependency Stats
            </Typography>
            <Stack sx={{ marginLeft: 1 }} spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <DescriptionRoundedIcon />
                <Typography variant="body1" fontWeight="bold">
                  Total size:{" "}
                </Typography>
                <Typography variant="body1">{fromBytes(agg_size)}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <WarningAmberOutlinedIcon color="warning" />
                <Typography variant="body1" fontWeight="bold">
                  Total warnings count:{" "}
                </Typography>
                <Typography variant="body1">{agg_warnings}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <KeyboardArrowDownRounded />
                <Typography variant="body1" fontWeight="bold">
                  Direct dependencies:{" "}
                </Typography>
                <Typography variant="body1">{direct_deps}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <KeyboardDoubleArrowDownRounded />
                <Typography variant="body1" fontWeight="bold">
                  Indirect dependencies:{" "}
                </Typography>
                <Typography variant="body1">{indirect_deps}</Typography>
              </Stack>
              <Stack spacing={1} direction="row" alignItems="center">
                <GavelRounded />
                <Typography variant="h6">Licenses</Typography>
              </Stack>
              {Object.entries(agg_license)
                .sort((a, b) => b[1] - a[1])
                .map(([license, count], i) => (
                  <Stack
                    key={license}
                    justifyContent="space-between"
                    direction="row"
                    sx={{ borderRadius: 100, paddingX: 2, backgroundColor: i % 2 !== 0 ? "#84848414" : undefined }}
                  >
                    <Typography variant="body1">{license}</Typography>
                    <Typography variant="body1">{count}</Typography>
                  </Stack>
                ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
