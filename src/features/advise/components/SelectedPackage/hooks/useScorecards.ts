import { useEffect, useMemo, useState } from "react";
import { getYamlFile } from "api";
import { components } from "lib/schema";

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

export const useScorecards = (justifications: Map<string, components["schemas"]["Justification"][number]>) => {
  const [scorecard, setScorecard] = useState<
    {
      tags: string;
      name: string;
      short: string;
      risk: string;
      passing?: boolean;
      justification?: string;
    }[]
  >([]);

  const scorecardJustifications = useMemo(() => {
    if (justifications) {
      return Array.from(justifications.values()).filter(s => {
        if (s.link === "https://github.com/ossf/scorecard/blob/main/docs/checks.md") {
          justifications.delete(s.message);
          return true;
        }
        return false;
      });
    }
  }, [justifications]);

  useEffect(() => {
    if (!justifications) {
      return;
    }

    let active = true;
    load();
    return () => {
      active = false;
    };

    async function load() {
      const res = await getYamlFile(
        "https://raw.githubusercontent.com/ossf/scorecard/main/docs/checks/internal/checks.yaml",
      ).then(yaml => {
        return Object.entries(yaml?.checks ?? {})
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
          });
      });
      if (!active) {
        return;
      }
      setScorecard(res);
    }
  }, [justifications]);

  return scorecard;
};
