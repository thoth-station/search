const useProd = true;
export const LOCAL_STORAGE_KEY = "THOTH_SEARCH_ADVISE_HISTORY";
export const THOTH_URL =
  !useProd && (process.env.REACT_APP_DEPLOYMENT === "STAGE" || process.env.NODE_ENV === "development")
    ? "https://stage.thoth-station.ninja/api/v1"
    : "https://khemenu.thoth-station.ninja/api/v1";
