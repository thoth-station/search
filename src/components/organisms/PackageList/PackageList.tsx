import React, { useMemo, useState } from "react";

// mui
import { Chip, List, ListItemButton, ListItemSecondaryAction, ListItemText, Stack, Typography } from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

// local
import SearchBar from "components/molecules/SearchBar";
import { useAdviseDocument } from "api";

interface IPackageList {
  analysis_id: string;
  selected_package?: string;
  onPackageClick: (pkg: string) => void;
}

/**
 * The table cells and total structure specific to
 * python packages.
 */
function PackageList({ analysis_id, selected_package, onPackageClick }: IPackageList) {
  const [search, setSearch] = useState<string>("");
  const { package_list, justifications } = useAdviseDocument(analysis_id);

  const handleSearch = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const alerts = useMemo(() => {
    const packageAlerts = new Map<string, { errors: number; warnings: number }>();

    if (justifications) {
      justifications.forEach(j => {
        const pkg_name = (j as unknown as { package_name: string })?.package_name;
        if (pkg_name) {
          packageAlerts.set(pkg_name, {
            errors: (j.type === "ERROR" ? 1 : 0) + (packageAlerts.get(pkg_name)?.errors ?? 0),
            warnings: (j.type === "WARNING" ? 1 : 0) + (packageAlerts.get(pkg_name)?.warnings ?? 0),
          });
        }
      });
    }

    return packageAlerts;
  }, [justifications]);

  if (!package_list || package_list.length === 0) {
    return null;
  }

  return (
    <Stack spacing={2} sx={{ maxHeight: "100%" }}>
      <SearchBar onChange={handleSearch} lefticon={<SearchRoundedIcon />} />
      <List sx={{ overflow: "scroll" }} dense>
        {package_list
          .filter(p => p.name.startsWith(search))
          .map(p => {
            return (
              <ListItemButton
                key={p.name + p.version}
                onClick={() => onPackageClick(p.name)}
                selected={selected_package === p.name}
                sx={{ borderRadius: 1.5 }}
              >
                <ListItemText primary={<Typography variant="h5">{p.name}</Typography>} secondary={`v${p.version}`} />
                <ListItemSecondaryAction>
                  <Stack direction="row" spacing={1}>
                    {alerts.get(p.name)?.warnings ? (
                      <Chip
                        variant="outlined"
                        size="medium"
                        icon={<WarningAmberOutlinedIcon />}
                        label={alerts.get(p.name)?.warnings}
                        color="warning"
                      />
                    ) : undefined}
                    {alerts.get(p.name)?.errors ? (
                      <Chip
                        variant="outlined"
                        size="medium"
                        icon={<ErrorOutlineOutlinedIcon />}
                        label={alerts.get(p.name)?.errors}
                        color="error"
                      />
                    ) : undefined}
                  </Stack>
                </ListItemSecondaryAction>
              </ListItemButton>
            );
          })}
      </List>
    </Stack>
  );
}

export default PackageList;
