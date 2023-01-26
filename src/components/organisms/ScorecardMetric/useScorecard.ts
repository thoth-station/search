import { useEffect, useMemo, useState } from "react";
import { getYamlFile } from "api";
import { components } from "lib/schema";
import { useQuery } from "@tanstack/react-query";

// match package name and scorecard justification
function getMatch(name: string, scorecards: components["schemas"]["Justification"]) {
  const matchLookup = {
    Maintained: "actively maintained",
    "Dependency-Update-Tool": "automatic dependency updates",
    "Binary-Artifacts": "binary artifacts",
    "Branch-Protection": "branch protection",
    "CI-Tests": "CI tests",
    "CII-Best-Practices": "CII Best Practices",
    "Code-Review": "code review",
    Contributors: "contributors",
    Fuzzing: "fuzzing",
    Packaging: "published as a package",
    "Pinned-Dependencies": "pinned dependencies",
    SAST: "static source code analysis",
    "Security-Policy": "security policy",
    "Signed-Releases": "sign tags",
    "Token-Permissions": "least privilege",
    Vulnerabilities: "vulnerabilities",
    "Dangerous-Workflow": "dangerous",
    License: "license",
  };

  const pattern = matchLookup[name as keyof typeof matchLookup];
  return scorecards.find(scorecard => scorecard.message.includes(pattern));
}

export type ScorecardJustificationType = {
  tags: string;
  name: string;
  short: string;
  risk: string;
  passing?: boolean | undefined;
  justification?: string | undefined;
}[];

export const useScorecard = (package_name?: string, justifications?: components["schemas"]["Justification"]) => {
  // scorecard metric state for specific package
  const [scorecard, setScorecard] = useState<ScorecardJustificationType>([]);

  // queries ossf data and caches it
  const ossfDefinitions = useQuery(["ossfDefs"], () => {
    return getYamlFile("https://raw.githubusercontent.com/ossf/scorecard/main/docs/checks/internal/checks.yaml");
  });

  const scorecardJustifications = useMemo(() => {
    if (justifications && package_name) {
      // extract only scorecard justifications
      return Array.from(justifications.values()).filter(s => {
        const justification = s as typeof s & { package_name?: string };
        if (
          justification.link === "https://github.com/ossf/scorecard/blob/main/docs/checks.md" &&
          justification.package_name === package_name
        ) {
          return true;
        }
        return false;
      });
    }
  }, [justifications, package_name]);

  useEffect(() => {
    if (!ossfDefinitions.data) {
      return;
    }

    setScorecard(
      Object.entries(ossfDefinitions.data?.checks ?? {})
        .filter(([key]) => getMatch(key, scorecardJustifications ?? []))
        .map(([name, value]) => {
          const info = value as { [k: string]: unknown };
          const match = getMatch(name, scorecardJustifications ?? []);
          return {
            tags: info?.tags as string,
            name: name as string,
            short: info?.short as string,
            risk: info?.risk as string,
            justification: match?.message as string,
            passing: match?.type !== "WARNING",
          };
        }),
    );
  }, [ossfDefinitions.data, scorecardJustifications]);

  // const query = useQuery({
  //   queryKey: ["vis_graph_edges", analysis_id],
  //   enabled: !!graph,
  //   queryFn: async () => queryFunction()
  // })

  // return {data: query.data, isLoading: query.isLoading, loadingProgress: null, loadingText: null};

  return scorecard;
};
