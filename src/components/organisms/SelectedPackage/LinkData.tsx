import React, { useMemo } from "react";
import { components } from "lib/schema";

import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";
import { Grid, Divider } from "@mui/material";
import IconText from "components/molecules/IconText";

const PATTERNS = [
  "libraries.io",
  "released on PyPI",
  "hosted on GitHub",
  "Release notes",
  "StackOverflow tags",
  "project documentation",
];

export const linkFilterFunction = (message: string) => {
  return PATTERNS.some(pattern => message.includes(pattern));
};

export const LinkData = ({ justifications }: { justifications?: components["schemas"]["Justification"] }) => {
  const linkData = useMemo(() => {
    let temp = {
      "libraries.io": {
        label: "libraries.io",
        icon: <OpenInNewRoundedIcon />,
        link: "",
      },
      "released on PyPI": {
        label: "PyPI",
        icon: <OpenInNewRoundedIcon />,
        link: "",
      },
      "hosted on GitHub": {
        label: "GitHub",
        icon: <GitHubIcon />,
        link: "",
      },
      "Release notes": {
        label: "Release",
        icon: <NewReleasesRoundedIcon />,
        link: "",
      },
      "StackOverflow tags": {
        label: "StackOverflow",
        icon: <OpenInNewRoundedIcon />,
        link: "",
      },
      "project documentation": {
        label: "Documentation",
        icon: <ArticleRoundedIcon />,
        link: "",
      },
    };

    if (justifications) {
      justifications.forEach(s => {
        PATTERNS.forEach(pattern => {
          if (s.message.includes(pattern)) {
            temp = {
              ...temp,
              [pattern]: {
                ...temp[pattern as unknown as keyof typeof temp],
                link: s?.link ?? "",
              },
            };
          }
        });
      });
    }

    Object.entries(temp).forEach(([key, value]) => {
      if (value.link === "") {
        delete temp[key as keyof typeof temp];
      }
    });

    return temp;
  }, [justifications]);

  return (
    <React.Fragment>
      {Object.values(linkData).map((value, i) => {
        return (
          <React.Fragment key={value?.link ?? "" + i}>
            <Grid item>
              <Divider orientation="vertical" />
            </Grid>
            <Grid key={value.label} item>
              <IconText text={value.label ?? ""} icon={value.icon} link={value?.link} />
            </Grid>
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};
