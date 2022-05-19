import React, { useMemo } from "react";
import { components } from "lib/schema";
import {
    StackInfoEnvMetric,
    StackInfoInstallErrorMetric,
    StackInfoMetric,
    StackInfoRulesMetric,
} from "../components/StackInfoMetrics";
import { Box, Typography } from "@mui/material";
import { Masonry } from "@mui/lab";

interface IAdviseStackInfo {
    stack_info?: components["schemas"]["StackInfo"];
}
const stackInfoHandler = (
    stack_info: components["schemas"]["StackInfo"],
    link: string,
) => {
    switch (link) {
        case "https://thoth-station.ninja/j/install_error": {
            const metric = stack_info
                .filter(info => info.link === link)
                .map(pkg => {
                    const name_index_pattern = /(?<=').*?(?=')/g;
                    const versions_pattern = /(?<=environment: ).*/;
                    const name_index = pkg.message.match(name_index_pattern);
                    const versions = pkg.message.match(versions_pattern);
                    if (name_index && versions) {
                        return {
                            package: name_index?.[0],
                            index: name_index?.[2],
                            versions: versions?.[0].split(", "),
                        };
                    }
                });
            return <StackInfoInstallErrorMetric url={link} metric={metric} />;
        }
        case "https://thoth-station.ninja/j/env": {
            const metric = stack_info
                .filter(info => info.link === link)
                .map(info => {
                    return {
                        provided: info.message.startsWith("No"),
                        message: info.message,
                    };
                });
            return <StackInfoEnvMetric metric={metric} url={link} />;
        }

        case "https://thoth-station.ninja/j/rules": {
            const rules = new Map<
                string,
                { package: string; constraint: string; index: string }[]
            >();
            stack_info
                .filter(info => info.link === link)
                .forEach(pkg => {
                    const name_constraint_index_pattern = /(?<=').*?(?=')/g;
                    const rule_pattern = /(?<=rule: ).*/;
                    const name_constraint_index = pkg.message.match(
                        name_constraint_index_pattern,
                    );
                    const rule = pkg.message.match(rule_pattern);
                    if (name_constraint_index && rule) {
                        rules.set(
                            rule[0],
                            (rules.get(rule[0]) ?? []).concat({
                                package: name_constraint_index?.[0],
                                constraint: name_constraint_index?.[2],
                                index: name_constraint_index?.[4],
                            }),
                        );
                    }
                });
            return (
                <StackInfoRulesMetric
                    metric={Object.fromEntries(rules)}
                    url={link}
                />
            );
        }
    }
};

export const AdviseStackInfo = ({ stack_info = [] }: IAdviseStackInfo) => {
    const metrics = useMemo(() => {
        if (!stack_info) {
            return <></>;
        }

        const types = new Set<string>();
        stack_info.forEach(i => types.add(i.link));

        const cards = [];
        Array.from(types.values()).forEach(type => {
            const element = stackInfoHandler(stack_info, type);
            if (element) {
                cards.push(element);
                types.delete(type);
            }
        });

        // all others
        const others = new Map<string, components["schemas"]["StackInfo"]>();
        stack_info
            .filter(info => types.has(info.link))
            .forEach(info => {
                others.set(
                    info.link,
                    (others.get(info.link) ?? []).concat(info),
                );
            });
        cards.push(<StackInfoMetric metrics={others} />);

        return cards;
    }, [stack_info]);

    if (!metrics) {
        return (
            <Box
                height="100vh"
                flexDirection="column"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Typography variant="h5" align="center">
                    Stack info not available
                </Typography>
                <Typography variant="body2" align="center">
                    The adviser has not finished resolving packages
                </Typography>
            </Box>
        );
    }

    return <Masonry columns={{ sm: 1, lg: 2, xl: 4 }}>{metrics}</Masonry>;
};
