import { useState, useEffect } from "react";

// function for generating file and set download link
export const MakeTextFile = file => {
  const [downloadLink, setDownloadLink] = useState("");

  useEffect(() => {
    if (!file) {
      return;
    }

    const data = new Blob([JSON.stringify(file, undefined, 4)], {
      type: "text/plain",
      endings: "native"
    });

    // this part avoids memory leaks
    if (downloadLink !== "") window.URL.revokeObjectURL(downloadLink);

    setDownloadLink(window.URL.createObjectURL(data));
  }, [file]);

  return downloadLink;
};
