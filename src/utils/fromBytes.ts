export const fromBytes = (bytes?: number) => {
  if (!bytes) {
    return "0 B";
  }

  const KB = bytes / 1000;
  if (KB < 1) {
    return `${bytes} B`;
  }

  const MB = bytes / 1e6;
  if (MB < 1) {
    return `${KB.toFixed(2)} KB`;
  }

  const GB = bytes / 1e9;
  if (GB < 1) {
    return `${MB.toFixed(2)} MB`;
  }

  const TB = bytes / 1e12;
  if (TB < 1) {
    return `${GB.toFixed(2)} GB`;
  } else {
    return `${TB.toFixed(2)} TB`;
  }
};
