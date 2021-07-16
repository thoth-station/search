export function parsePipfile(text) {
  return true;
}

export function parsePipfileLock(text) {
  return true;
  const lockFile = JSON.parse(text);
  const roots = Object.entries(lockFile.default).map(([k, v]) => {
    return { name: k, version: v.version.replace("==", "") };
  });
  return roots;
}
