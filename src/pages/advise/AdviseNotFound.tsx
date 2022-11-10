import React from "react";

interface IAdviseNotFound {
  analysis_id: string;
}

export const AdviseNotFound = ({ analysis_id }: IAdviseNotFound) => {
  return <div>`&quot;{analysis_id}&quot;` not found</div>;
};
