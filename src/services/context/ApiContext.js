import React, { createContext, useContext, useState } from "react";

// ApiContext provides a single place to configure the API base URL
// and a small wrapper helper `apiFetch` used across non-component modules.
// Usage:
// - In the app root: <ApiProvider initialBase={process.env.REACT_APP_API_BASE}>
// - In components: const { baseUrl, setBaseUrl } = useApiConfig();
// - In service modules: import { apiFetch } from "../context/ApiContext";

const DEFAULT_BASE = process.env.REACT_APP_API_BASE || "/api";

export const ApiConfigContext = createContext({
  baseUrl: DEFAULT_BASE,
  setBaseUrl: () => {},
});

export function ApiProvider({ children, initialBase }) {
  const [baseUrl, setBaseUrl] = useState(initialBase || DEFAULT_BASE);
  return (
    <ApiConfigContext.Provider value={{ baseUrl, setBaseUrl }}>
      {children}
    </ApiConfigContext.Provider>
  );
}

export function useApiConfig() {
  return useContext(ApiConfigContext);
}

export function getApiBase() {
  const env = process.env.REACT_APP_API_BASE;
  if (env && env.length > 0) return env.replace(/\/$/, "");
  return DEFAULT_BASE;
}

export async function apiFetch(path, options) {
  const base = getApiBase();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${base}${normalizedPath}`;
  return fetch(url, options);
}

export default ApiConfigContext;
