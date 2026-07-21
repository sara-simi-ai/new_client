import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import {
  getAllTsevetMevatsea,
  insertTsevetMevatsea,
  updateTsevetMevatsea,
  toggleTsevetMevatseaActive,
} from "../api/tsevetMevatseaApi";

const TsevetMevatzeatContext = createContext();

function normalizeTsevetMevatseaFromApi(tsevetMevatsea) {
  return {
    ...tsevetMevatsea,
    id: tsevetMevatsea.idntTsevetMevatsea,
    name: tsevetMevatsea.tsevetMevatseaName || "",
    active: tsevetMevatsea.active ?? true,
  };
}

function normalizeTsevetMevatseaForApi(tsevetMevatsea) {
  return {
    idntTsevetMevatsea: tsevetMevatsea.id ?? tsevetMevatsea.idntTsevetMevatsea,
    tsevetMevatseaName: tsevetMevatsea.name ?? tsevetMevatsea.tsevetMevatseaName ?? "",
    active: tsevetMevatsea.active ?? true,
  };
}

export function TsevetMevatzeatProvider({ children }) {
  const [tsevetMevatzeatList, setTsevetMevatzeatList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTsevetId, setSelectedTsevetId] = useState(null);
  const [selectedTsevetIds, setSelectedTsevetIds] = useState([]);
  const [filters, setFilters] = useState({});

  // Load all TsevetMevatsea on mount
  useEffect(() => {
    let mounted = true;
    async function fetchTsevetMevatzeat() {
      setIsLoading(true);
      try {
        const data = await getAllTsevetMevatsea();
        const normalized = (data || []).map(normalizeTsevetMevatseaFromApi);
        if (!mounted) return;
        setTsevetMevatzeatList(normalized);
        setSelectedTsevetId(null);
      } catch (err) {
        console.error("שגיאה בטעינת צוותי מבצע:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    fetchTsevetMevatzeat();
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

  const filteredTsevetMevatzeat = useMemo(() => {
    let result = tsevetMevatzeatList;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((t) => t.name && t.name.toLowerCase().includes(searchLower));
    }

    if (filters.active !== undefined) {
      result = result.filter((t) => t.active === filters.active);
    }

    return result;
  }, [tsevetMevatzeatList, filters]);

  const tsevetMevatzeatOptions = useMemo(() => {
    // Only expose active tsevet entries for normal selection flows.
    return tsevetMevatzeatList
      .filter((t) => t.active)
      .map((t) => ({
        value: t.id,
        label: t.name || "—",
      }));
  }, [tsevetMevatzeatList]);

  const addNewTsevetMevatzeat = useCallback(async (tsevetData) => {
    const fullData = normalizeTsevetMevatseaForApi(tsevetData);
    const savedTsevet = await insertTsevetMevatsea(fullData);
    const normalizedSaved = normalizeTsevetMevatseaFromApi(savedTsevet);
    setTsevetMevatzeatList((prev) => [...prev, normalizedSaved]);
    return normalizedSaved;
  }, []);

  const updateTsevetData = useCallback(async (tsevetData) => {
    const toSend = normalizeTsevetMevatseaForApi(tsevetData);
    const updated = await updateTsevetMevatsea(tsevetData.id, toSend);
    const normalizedUpdated = normalizeTsevetMevatseaFromApi(updated);
    setTsevetMevatzeatList((prev) =>
      prev.map((t) => (t.id === normalizedUpdated.id ? normalizedUpdated : t))
    );
    return normalizedUpdated;
  }, []);

  // NOTE: TsevetMevatseaController has no delete endpoint, only insert/get/update/toggle.
  // Deactivation is handled via toggleTsevetStatus below instead of deletion.

  const toggleTsevetStatus = useCallback(async (id) => {
    const updated = await toggleTsevetMevatseaActive(id);
    const normalizedUpdated = normalizeTsevetMevatseaFromApi(updated);
    setTsevetMevatzeatList((prev) =>
      prev.map((t) => (t.id === normalizedUpdated.id ? normalizedUpdated : t))
    );
    return normalizedUpdated;
  }, []);

  const selectedTsevetMevatzeat = useMemo(
    () => tsevetMevatzeatList.find((t) => t.id === selectedTsevetId) || null,
    [tsevetMevatzeatList, selectedTsevetId]
  );

  const toggleTsevetSelection = useCallback((tsevetId) => {
    setSelectedTsevetIds((prev) =>
      prev.includes(tsevetId) ? prev.filter((id) => id !== tsevetId) : [...prev, tsevetId]
    );
  }, []);

  const selectAllFilteredTsevet = useCallback(() => {
    setSelectedTsevetIds(filteredTsevetMevatzeat.map((t) => t.id));
  }, [filteredTsevetMevatzeat]);

  const clearTsevetSelection = useCallback(() => {
    setSelectedTsevetIds([]);
  }, []);

  const value = useMemo(
    () => ({
      tsevetMevatzeatList,
      filteredTsevetMevatzeat,
      isLoading,
      selectedTsevetId,
      setSelectedTsevetId,
      selectedTsevetMevatzeat,
      selectedTsevetIds,
      toggleTsevetSelection,
      selectAllFilteredTsevet,
      clearTsevetSelection,
      tsevetMevatzeatOptions,
      filters,
      updateFilter,
      clearFilters,
      addNewTsevetMevatzeat,
      updateTsevetData,
      toggleTsevetStatus,
    }),
    [
      tsevetMevatzeatList,
      filteredTsevetMevatzeat,
      isLoading,
      selectedTsevetId,
      selectedTsevetMevatzeat,
      selectedTsevetIds,
      tsevetMevatzeatOptions,
      filters,
      updateFilter,
      clearFilters,
      addNewTsevetMevatzeat,
      updateTsevetData,
      toggleTsevetStatus,
      toggleTsevetSelection,
      selectAllFilteredTsevet,
      clearTsevetSelection,
      setSelectedTsevetId,
    ],
  );

  return (
    <TsevetMevatzeatContext.Provider value={value}>{children}</TsevetMevatzeatContext.Provider>
  );
}

export function useTsevetMevatzeat() {
  const context = useContext(TsevetMevatzeatContext);
  if (!context) throw new Error("useTsevetMevatzeat must be used within a TsevetMevatzeatProvider");
  return context;
}