import React, { useContext, useMemo, useState } from "react";

import {
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

// local
import { SelectedPackageContext } from "../../routes/AdviseDetails";
import { Graph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";
import { PackageNodeValue } from "lib/interfaces/PackageNodeValue";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SearchBar from "components/Elements/SearchBar";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

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
    const { selected, setSelected } = useContext(SelectedPackageContext) ?? {
        setSelected: () => console.log("missing callback"),
    };

    const [search, setSearch] = useState<string>("");

    const handleSearch = (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
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
                warnings:
                    node.value.justifications?.filter(j => j.type === "WARNING")
                        ?.length ?? 0,
                errors:
                    node.value.justifications?.filter(j => j.type === "ERROR")
                        ?.length ?? 0,
            });
        });

        return packages;
    }, [graph]);

    if (!graph) {
        return null;
    }

    return (
        <Stack spacing={2}>
            <SearchBar
                onChange={handleSearch}
                lefticon={<SearchRoundedIcon />}
            />
            {packageList
                .filter(p => p.name.startsWith(search))
                .map(p => {
                    return (
                        <Card
                            elevation={0}
                            key={p.key}
                            sx={{
                                backgroundColor:
                                    selected === p.key
                                        ? "secondaryContainer.main"
                                        : undefined,
                                color:
                                    selected === p.key
                                        ? "secondaryContainer.contrast_text"
                                        : undefined,
                            }}
                        >
                            <CardActionArea onClick={() => setSelected(p.key)}>
                                <CardHeader
                                    title={p.name}
                                    subheader={`v${p.version}`}
                                    action={
                                        <Stack direction="row" spacing={1}>
                                            {p.warnings ? (
                                                <Chip
                                                    variant="outlined"
                                                    size="medium"
                                                    icon={
                                                        <WarningAmberOutlinedIcon />
                                                    }
                                                    label={p.warnings}
                                                    color="warning"
                                                />
                                            ) : undefined}
                                            {p.errors ? (
                                                <Chip
                                                    variant="outlined"
                                                    size="medium"
                                                    icon={
                                                        <ErrorOutlineOutlinedIcon />
                                                    }
                                                    label={p.errors}
                                                    color="error"
                                                />
                                            ) : undefined}
                                        </Stack>
                                    }
                                />
                                {p.summary ? (
                                    <CardContent>
                                        <Typography variant="body2">
                                            {p.summary}
                                        </Typography>
                                    </CardContent>
                                ) : undefined}
                            </CardActionArea>
                        </Card>
                    );
                })}
        </Stack>
    );
}
