const STORAGE_KEY = "thoth-search-cache";

export const cacheGet = (group, key) => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}")?.[group]?.[
      key
    ];
  } catch (error) {
    cacheReset();
    return undefined;
  }
};

export const cacheSet = (group, key, value) => {
  let cache = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");

  cache[group] = { ...cache[group], [key]: value };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
};

export const cacheReset = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const cacheLoad = cache => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
};
