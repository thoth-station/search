import { useQuery } from "@tanstack/react-query";
import { useAdviseDocument } from "api";
import { useLicenseMetric } from "./useLicenseMetric";

export const useSidebarTotals = (analysis_id: string) => {
  const { stack_info } = useAdviseDocument(analysis_id);
  const { data: licenseMetric } = useLicenseMetric(analysis_id);

  const computeLicenseMetricTotals = () => {
    const data = {
      info: 0,
      warning: 0,
      error: 0,
    };

    if (!licenseMetric) {
      return data;
    }

    Object.values(licenseMetric).forEach(license => {
      switch (license.metadata.isOsiApproved) {
        case null:
          data.warning += Object.keys(license.packages).length;
          break;
        case false:
          data.error += Object.keys(license.packages).length;
          break;
      }
    });

    return data;
  };

  const computeStackInfoTotals = () => {
    if (!stack_info) {
      return {
        info: 0,
        warning: 0,
        error: 0,
      };
    }
    return {
      info: stack_info.filter(t => t.type === "INFO").length ?? 0,
      warning: stack_info.filter(t => t.type === "WARNING").length ?? 0,
      error: stack_info.filter(t => t.type === "ERROR").length ?? 0,
    };
  };

  const queryFunction = () => {
    return {
      "stack-info": computeStackInfoTotals(),
      licenses: computeLicenseMetricTotals(),
    };
  };

  const query = useQuery({
    queryKey: ["sidebar_totals", analysis_id],
    enabled: !!stack_info && !!licenseMetric,
    queryFn: async () => queryFunction(),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    loadingProgress: null,
    loadingText: "totaling warnings and errors",
  };
};
