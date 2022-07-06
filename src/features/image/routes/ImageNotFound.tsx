import React from "react";

interface IImageNotFound {
  analysis_id?: string;
}

export const ImageNotFound = ({ analysis_id }: IImageNotFound) => {
  return <div> &quot;{analysis_id}&quot; not found</div>;
};
