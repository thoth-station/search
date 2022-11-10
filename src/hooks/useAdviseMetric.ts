import { useState } from "react";
import { useGraph } from "./useGraph";
import { useAdviseDocument } from "api";
import { useQuery } from "@tanstack/react-query";

export type AdviseMetricType = {
  justification: Record<string, number>;
  /** which build is being displayed (new or old) */
  build: string;
};

export const useAdviseMetric = (analysis_id: string) => {
  const { data: graph } = useGraph(analysis_id);
  const { metadata, justifications } = useAdviseDocument(analysis_id);
  const [loadingProgress, setLoadingProgress] = useState<number | null>(null);
  const [loadingText, setLoadingText] = useState<string | null>(null);

  const queryFunction = () => {
    if (!graph || !metadata || !justifications) {
      throw "Missing input data";
    }

    setLoadingProgress(0);
    setLoadingText("Counting justifications");

    const base: AdviseMetricType = {
      justification: {},
      build: "",
    };

    //build environment
    base.build = `We have analyzed an application stack running on ${metadata.os_release.name} ${metadata.os_release.version}, running Python (${metadata.python.implementation_name}) ${metadata.python.major}.${metadata.python.minor}.${metadata.python.micro}. It was Adviser Job ID ${metadata.document_id}, by ${metadata.analyzer} v${metadata.analyzer_version}.`;

    //justification counts
    justifications?.forEach((justification, i) => {
      setLoadingProgress(i / justifications.length);
      if (base.justification[justification.type]) {
        base.justification[justification.type] = base.justification[justification.type] + 1;
      } else {
        base.justification[justification.type] = 1;
      }
    });

    return base;
  };

  const query = useQuery({
    queryKey: ["advise_metric", analysis_id],
    enabled: !!graph && !!metadata,
    queryFn: async () => queryFunction(),
  });

  return { data: query.data, isLoading: query.isLoading, isError: query.isError, loadingProgress, loadingText };
};
