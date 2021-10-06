import stored_cache from "assets/cache.json";

const STORAGE_KEY = "thoth-search-cache";
const devMode = true;

export const cacheGet = (group, key) => {
  try {
    if (devMode) {
      return stored_cache?.[group]?.[key];
    } else {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")?.[group]?.[
        key
      ];
    }
  } catch (error) {
    cacheReset();
    return undefined;
  }
};

export const cacheSet = (group, key, value) => {
  if (devMode) {
    return;
  }
  let cache = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");

  cache[group] = { ...cache[group], [key]: value };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
};

export const cacheReset = () => {
  if (devMode) {
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
};
