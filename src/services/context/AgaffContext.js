import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { getAllAgaff, insertAgaff, updateAgaff, toggleAgaffActive } from "../api/agaffApi";

const AgaffContext = createContext();

// The Agaff model in C# (Agaff.cs) only has: IdntAgaff (Guid), AgaffName (string), Active (bool).
// ASP.NET Core serializes these to camelCase JSON: idntAgaff, agaffName, active.
// We normalize once here at the API boundary and expose convenient `id`/`name`
// aliases so the rest of the app (ProjectsContext, forms, etc.) doesn't need to
// know about the C#-side property names.
function normalizeAgaffFromApi(agaff) {
  return {
    ...agaff,
    id: agaff.idntAgaff,
    name: agaff.agaffName || "",
    active: agaff.active ?? true,
  };
}

function normalizeAgaffForApi(agaff) {
  return {
    idntAgaff: agaff.id ?? agaff.idntAgaff,
    agaffName: agaff.name ?? agaff.agaffName ?? "",
    active: agaff.active ?? true,
  };
}

export function AgaffProvider({ children }) {
  const [agaffList, setAgaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgaffId, setSelectedAgaffId] = useState(null);
  const [selectedAgaffIds, setSelectedAgaffIds] = useState([]);
  const [filters, setFilters] = useState({});

  // Load all Agaff on mount
  useEffect(() => {
    let mounted = true;
    async function fetchAgaff() {
      setIsLoading(true);
      try {
        const data = await getAllAgaff();
        const normalized = (data || []).map(normalizeAgaffFromApi);
        if (!mounted) return;
        setAgaffList(normalized);
        setSelectedAgaffId(null);
      } catch (err) {
        console.error("שגיאה בטעינת אגפים:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    fetchAgaff();
    return () => {
      mounted = false;
    };
  }, []);

  const updateFilter = useCallback((filterName, value) => {
    setFilters((prev) => {
      if (prev[filterName] === value) return prev;
      return { ...prev, [filterName]: value };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters((prev) => (Object.keys(prev).length ? {} : prev));
  }, []);

  const filteredAgaff = useMemo(() => {
    let result = agaffList;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((a) => a.name && a.name.toLowerCase().includes(searchLower));
    }

    if (filters.active !== undefined) {
      result = result.filter((a) => a.active === filters.active);
    }

    return result;
  }, [agaffList, filters]);

  const agaffOptions = useMemo(() => {
    // Only expose active items as selectable options across the app.
    // The full list (including inactive) remains available as `agaffList`
    // for admin/management screens that intentionally show inactive entries.
    return agaffList
      .filter((a) => a.active)
      .map((a) => ({
        value: a.id,
        label: a.name || "—",
      }));
  }, [agaffList]);

  const addNewAgaff = useCallback(async (agaffData) => {
    const fullData = normalizeAgaffForApi(agaffData);
    const savedAgaff = await insertAgaff(fullData);
    const normalizedSaved = normalizeAgaffFromApi(savedAgaff);
    setAgaffList((prev) => [...prev, normalizedSaved]);
    return normalizedSaved;
  }, []);

  const updateAgaffData = useCallback(async (agaffData) => {
    const toSend = normalizeAgaffForApi(agaffData);
    const updated = await updateAgaff(agaffData.id, toSend);
    const normalizedUpdated = normalizeAgaffFromApi(updated);
    setAgaffList((prev) =>
      prev.map((a) => (a.id === normalizedUpdated.id ? normalizedUpdated : a))
    );
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portfolio:metadataUpdated', { detail: { entity: 'agaff' } }));
    }
    return normalizedUpdated;
  }, []);

  const toggleAgaffStatus = useCallback(async (id) => {
    const updated = await toggleAgaffActive(id);
    const normalizedUpdated = normalizeAgaffFromApi(updated);
    setAgaffList((prev) =>
      prev.map((a) => (a.id === normalizedUpdated.id ? normalizedUpdated : a))
    );
    return normalizedUpdated;
  }, []);

  const selectedAgaff = useMemo(
    () => agaffList.find((a) => a.id === selectedAgaffId) || null,
    [agaffList, selectedAgaffId]
  );

  const toggleAgaffSelection = useCallback((agaffId) => {
    setSelectedAgaffIds((prev) =>
      prev.includes(agaffId) ? prev.filter((id) => id !== agaffId) : [...prev, agaffId]
    );
  }, []);

  const selectAllFilteredAgaff = useCallback(() => {
    setSelectedAgaffIds(filteredAgaff.map((a) => a.id));
  }, [filteredAgaff]);

  const clearAgaffSelection = useCallback(() => {
    setSelectedAgaffIds([]);
  }, []);

  const value = useMemo(
    () => ({
      agaffList,
      filteredAgaff,
      isLoading,
      selectedAgaffId,
      setSelectedAgaffId,
      selectedAgaff,
      selectedAgaffIds,
      toggleAgaffSelection,
      selectAllFilteredAgaff,
      clearAgaffSelection,
      agaffOptions,
      filters,
      updateFilter,
      clearFilters,
      addNewAgaff,
      updateAgaffData,
      toggleAgaffStatus,
    }),
    [
      agaffList,
      filteredAgaff,
      isLoading,
      selectedAgaffId,
      setSelectedAgaffId,
      selectedAgaff,
      selectedAgaffIds,
      toggleAgaffSelection,
      selectAllFilteredAgaff,
      clearAgaffSelection,
      agaffOptions,
      filters,
      updateFilter,
      clearFilters,
      addNewAgaff,
      updateAgaffData,
      toggleAgaffStatus,
    ]
  );

  return <AgaffContext.Provider value={value}>{children}</AgaffContext.Provider>;
}

export function useAgaff() {
  const context = useContext(AgaffContext);
  if (!context) throw new Error("useAgaff must be used within an AgaffProvider");
  return context;
}