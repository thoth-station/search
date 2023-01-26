import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import PackageList from "components/organisms/PackageList";
import SelectedPackage from "components/organisms/SelectedPackage";

export const AdviseDetails = ({ analysis_id }: { analysis_id: string }) => {
  const params = useParams();
  const [selected, setSelected] = useState<string>("");
  // const {isLoading, isError, LoadingComponent} = useGraph(analysis_id)
  const navigate = useNavigate();

  useEffect(() => {
    if (params.pkg) {
      setSelected(params.pkg);
    }
  }, [params.pkg]);

  // if(isLoading || isError) {
  //   return (
  //     <LoadingComponent errorSubtitle="Package data not available. The advise run encountered an error." />
  //   )
  // }

  return (
    <Box flexDirection="column" display="flex" height="100%" justifyContent="center" alignItems="flex-start">
      <Box flexGrow={1} display="flex" sx={{ overflowY: "hidden", width: "100%" }}>
        <Box overflow="auto" sx={{ marginRight: 2, minWidth: "500px" }}>
          <PackageList
            selected_package={selected}
            analysis_id={analysis_id}
            onPackageClick={key => {
              setSelected(key);
              navigate("../packages/" + key);
            }}
          />
        </Box>
        <Box overflow="auto" sx={{ minWidth: "50%", width: "100%" }}>
          {!selected ? (
            <Box height="100%" flexDirection="column" display="flex" justifyContent="center" alignItems="center">
              <Typography variant="h5" align="center">
                Choose a package
              </Typography>
              <Typography variant="body2" align="center">
                Click on a package from the packages found in the Pipfile.lock
              </Typography>
            </Box>
          ) : (
            <SelectedPackage
              selectedPackage={selected}
              analysis_id={analysis_id}
              setSelectedPackage={key => {
                setSelected(key);
                navigate("../packages/" + key);
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};
