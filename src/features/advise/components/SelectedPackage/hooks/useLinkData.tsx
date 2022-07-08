import React, { useEffect, useState } from "react";
import { components } from "lib/schema";

import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";

export const useLinkData = (justifications: Map<string, components["schemas"]["Justification"][number]>) => {
  const [linkData, setLinkData] = useState<{
    [key: string]: {
      label?: string;
      icon?: React.ReactNode;
      link?: string;
    };
  }>({
    "libraries.io": {
      label: "libraries.io",
      icon: <OpenInNewRoundedIcon />,
    },
    "released on PyPI": {
      label: "PyPI",
      icon: <OpenInNewRoundedIcon />,
    },
    "hosted on GitHub": {
      label: "GitHub",
      icon: <GitHubIcon />,
    },
    "Release notes": {
      label: "Release",
      icon: <NewReleasesRoundedIcon />,
    },
    "StackOverflow tags": {
      label: "StackOverflow",
      icon: <OpenInNewRoundedIcon />,
    },
    "project documentation": {
      label: "Documentation",
      icon: <ArticleRoundedIcon />,
    },
  });

  useEffect(() => {
    const patterns = Object.keys(linkData);
    let temp = linkData;

    if (justifications) {
      Array.from(justifications.values()).forEach(s => {
        patterns.forEach(pattern => {
          if (s.message.includes(pattern)) {
            justifications.delete(s.message);
            temp = {
              ...temp,
              [pattern]: {
                ...temp[pattern],
                link: s?.link ?? "",
              },
            };
          }
        });
      });
    }

    Object.entries(temp).forEach(([key, value]) => {
      if (!value.link) {
        delete temp[key];
      }
    });

    setLinkData(temp);
  }, [justifications]);

  return linkData;
};
