import React, { useContext, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { SelectedPackage } from "../components";
import { Graph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";
import { PackageNodeValue } from "lib/interfaces/PackageNodeValue";
import { PackageList } from "../components/PackageList";
import Loading from "components/Elements/Loading/Loading";
import { StateContext } from "stores/Global";
import { useParams } from "react-router-dom";

type SelectedPackageType = {
  selected: string;
  setSelected: (c: string) => void;
};

export const SelectedPackageContext = React.createContext<SelectedPackageType>({} as SelectedPackageType);

interface IAdviseDetails {
  graph?: Graph<Node<PackageNodeValue>>;
}

export const AdviseDetails = ({ graph }: IAdviseDetails) => {
  const params = useParams();
  const [selected, setSelected] = useState<string>("");
  const state = useContext(StateContext);

  useEffect(() => {
    if (params.pkg) {
      setSelected(params.pkg);
    }
  }, [params.pkg]);

  if (!graph) {
    if (!state?.loading?.["graph"]) {
      return (
        <Box height="100vh" flexDirection="column" display="flex" justifyContent="center" alignItems="center">
          <Typography variant="h5" align="center">
            Package data not available
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

  if (graph.nodes.size === 1) {
    return (
      <Box height="100%" flexDirection="column" display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h5" align="center">
          No packages found
        </Typography>
        <Typography variant="body2" align="center">
          The advise document encountered an error resulting in no Pipfile.lock
        </Typography>
      </Box>
    );
  }

  return (
    <SelectedPackageContext.Provider value={{ selected, setSelected }}>
      <Box flexDirection="column" display="flex" height="100%" justifyContent="center" alignItems="flex-start">
        <Box flexGrow={1} display="flex" sx={{ overflowY: "hidden", width: "100%" }}>
          <Box overflow="auto" sx={{ marginRight: 2, minWidth: "500px" }}>
            <PackageList graph={graph} />
          </Box>
          <Box overflow="auto" sx={{ minWidth: "50%", width: "100%" }}>
            {!selected || !graph ? (
              <Box height="100%" flexDirection="column" display="flex" justifyContent="center" alignItems="center">
                <Typography variant="h5" align="center">
                  Choose a package
                </Typography>
                <Typography variant="body2" align="center">
                  Click on a package from the packages found in the Pipfile.lock
                </Typography>
              </Box>
            ) : (
              <SelectedPackage graph={graph} />
            )}
          </Box>
        </Box>
      </Box>
    </SelectedPackageContext.Provider>
  );
};
