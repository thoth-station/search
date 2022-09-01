import React, { useContext, useEffect, useMemo, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
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
import Loading from "components/Elements/Loading/Loading";
import { StateContext } from "stores/Global";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { DependencyMetricType } from "hooks/metrics";
import { Graph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";
import { PackageNodeValue } from "lib/interfaces/PackageNodeValue";
import { TransitionGroup } from "react-transition-group";
import { fromBytes } from "utils/fromBytes";
import { GavelRounded, KeyboardArrowDownRounded, KeyboardDoubleArrowDownRounded } from "@mui/icons-material";
import NetworkGraphView from "../components/NetworkGraphView";

interface IAdviseDependencies {
  metric: DependencyMetricType | null;
  graph?: Graph<Node<PackageNodeValue>>;
}

export function AdviseDependencies({ metric, graph }: IAdviseDependencies) {
  const state = useContext(StateContext);
  const [selected, setSelected] = useState<Node<PackageNodeValue>>();

  useEffect(() => {
    if (graph) {
      const root = graph.nodes.get("*App");
      if (root) {
        setSelected(root);
      }
    }
  }, [graph]);

  const [pkgs, selectedIndex] = useMemo(() => {
    if (graph && selected) {
      const ar = [
        ...[...(selected?.parents.values() ?? [])].map(k => graph.nodes.get(k)).filter(node => node !== undefined),
        selected,
        ...[...(selected?.adjacents.values() ?? [])],
      ] as Node<PackageNodeValue>[];
      const index = ar.findIndex(node => node.key === selected.key);
      return [ar, index];
    }
    return [[], 0];
  }, [selected, graph]);

  const [agg_size, agg_license, agg_warnings, direct_deps, indirect_deps] = useMemo(() => {
    if (graph && selected) {
      let size = 0;
      const licenses: { [key: string]: number } = {};
      let warnings = 0;
      let direct = 0;
      let indirect = 0;

      const bfs = graph.graphSearch(selected);
      const adjs = [...(selected.adjacents.values() ?? [])].map(n => n.key);
      Array.from(bfs).forEach(node => {
        size += node.value.install_size ?? 0;
        warnings += node?.value?.justifications?.reduce((p, c) => (c.type === "WARNING" ? p + 1 : p), 0) ?? 0;
        if (licenses[node.value.metadata?.License ?? "Not found"]) {
          licenses[node.value.metadata?.License ?? "Not found"] += 1;
        } else {
          licenses[node.value.metadata?.License ?? "Not found"] = 1;
        }

        // deps
        if (adjs.includes(node.key)) {
          direct += 1;
        } else if (node.key !== selected.key) {
          indirect += 1;
        }
      });

      return [size, licenses, warnings, direct, indirect];
    }

    return [0, [], 0, 0, 0];
  }, [selected, graph]);

  if (!metric || !graph) {
    if (!state?.loading?.["graph"]) {
      return (
        <Box height="100vh" flexDirection="column" display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h5" align="center">
            Dependency data not available
          </Typography>
          <Typography variant="body2" align="center">
            The advise run encountered an error.
          </Typography>
        </Box>
      );
    }
    return (
      <Loading
        type="circular"
        label={state?.loading?.["graph"].text}
        progress={((state?.loading?.["graph"].value ?? 0) / (state?.loading?.["graph"].total ?? 1)) * 100}
      />
    );
  }

  return (
    <Grid container columnSpacing={4} rowSpacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">Dependency Tree</Typography>
        <Typography variant="body1">
          A Python environment&apos;s packages can be organized as a one directional graph with root packages generally
          being the dependncies defined in the Pipfile.
        </Typography>
      </Grid>
      <Grid item xs={6} sx={{ marginTop: 1 }}>
        <List>
          {selectedIndex > 0 && pkgs.at(0)?.key !== "*App" ? (
            <ListItem sx={{ paddingBottom: 0 }}>
              <ListItemText>
                <Typography variant="body2" fontWeight="bold" sx={{ color: "gray" }}>
                  Dependents
                </Typography>
              </ListItemText>
            </ListItem>
          ) : undefined}
          <TransitionGroup>
            {pkgs.map((node, i) => (
              <Collapse key={node.key}>
                {i === selectedIndex + 1 ? (
                  <>
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
                    {i === selectedIndex && selectedIndex !== 0 ? <Divider sx={{ marginY: 1 }} /> : undefined}
                  </>
                ) : undefined}
                <ListItem
                  selected={node.key === selected?.key}
                  key={node.key}
                  disablePadding
                  sx={{ borderRadius: 100 }}
                >
                  <ListItemButton onClick={() => setSelected(node)} sx={{ borderRadius: 100 }}>
                    {i < selectedIndex && node.key !== "*App" && (
                      <ListItemAvatar>
                        <ArrowUpwardRoundedIcon />
                      </ListItemAvatar>
                    )}
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
                    {node.key === selected?.key ? (
                      <Chip sx={{ fontStyle: "italic" }} label="Selected" />
                    ) : (
                      node.adjacents.size > 0 && node.key !== "*App" && <Chip label={node.adjacents.size} />
                    )}
                  </ListItemButton>
                </ListItem>
              </Collapse>
            ))}
          </TransitionGroup>
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
                <NetworkGraphView graph={graph} graphHeight="25vh" root={selected} />
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                  Package Stats
                </Typography>
                <Stack sx={{ marginLeft: 1 }} spacing={1.5}>
                  <Stack direction="row" spacing={1}>
                    <DescriptionRoundedIcon />
                    <Typography variant="body1" fontWeight="bold">
                      Package size:{" "}
                    </Typography>
                    <Typography variant="body1">{fromBytes(selected?.value.install_size)}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <WarningAmberOutlinedIcon color="warning" />
                    <Typography variant="body1" fontWeight="bold">
                      Package warnings count:{" "}
                    </Typography>
                    <Typography variant="body1">
                      {selected?.value.justifications?.filter(j => j.type === "WARNING").length}
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
