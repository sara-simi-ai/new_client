import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { getAllTsevetMevatsea, insertTsevetMevatsea, updateTsevetMevatsea, deleteTsevetMevatsea } from "../api/tsevetMevatseaApi";

const TsevetMevatzeatContext = createContext();

function normalizeTsevetMevatseaFromApi(tsevetMevatsea) {
  return {
    ...tsevetMevatsea,
    name: tsevetMevatsea.name || "",
    description: tsevetMevatsea.description || "",
  };
}

function normalizeTsevetMevatseaForApi(tsevetMevatsea) {
  return {
    ...tsevetMevatsea,
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

  const updateFilter = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const filteredTsevetMevatzeat = useMemo(() => {
    let result = tsevetMevatzeatList;
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          (t.name && t.name.toLowerCase().includes(searchLower)) ||
          (t.description && t.description.toLowerCase().includes(searchLower))
      );
    }

    if (filters.active !== undefined) {
      result = result.filter((t) => t.active === filters.active);
    }

    return result;
  }, [tsevetMevatzeatList, filters]);

  const tsevetMevatzeatOptions = useMemo(() => {
    return tsevetMevatzeatList.map((t) => ({
      value: t.id,
      label: t.name || "—",
    }));
  }, [tsevetMevatzeatList]);

  const addNewTsevetMevatzeat = async (tsevetData) => {
    const fullData = normalizeTsevetMevatseaForApi(tsevetData);
    const savedTsevet = await insertTsevetMevatsea(fullData);
    const normalizedSaved = normalizeTsevetMevatseaFromApi(savedTsevet);
    setTsevetMevatzeatList((prev) => [...prev, normalizedSaved]);
    return normalizedSaved;
  };

  const updateTsevetData = async (tsevetData) => {
    const toSend = normalizeTsevetMevatseaForApi(tsevetData);
    const updated = await updateTsevetMevatsea(tsevetData.id, toSend);
    const normalizedUpdated = normalizeTsevetMevatseaFromApi(updated);
    setTsevetMevatzeatList((prev) =>
      prev.map((t) => (t.id === normalizedUpdated.id ? normalizedUpdated : t))
    );
    return normalizedUpdated;
  };

  const deleteTsevetData = async (id) => {
    await deleteTsevetMevatsea(id);
    setTsevetMevatzeatList((prev) => prev.filter((t) => t.id !== id));
    setSelectedTsevetId((prev) => (prev === id ? null : prev));
    return id;
  };

  const selectedTsevetMevatzeat = useMemo(
    () => tsevetMevatzeatList.find((t) => t.id === selectedTsevetId) || null,
    [tsevetMevatzeatList, selectedTsevetId]
  );

  const toggleTsevetSelection = (tsevetId) => {
    setSelectedTsevetIds((prev) =>
      prev.includes(tsevetId)
        ? prev.filter((id) => id !== tsevetId)
        : [...prev, tsevetId]
    );
  };

  const selectAllFilteredTsevet = () => {
    setSelectedTsevetIds(filteredTsevetMevatzeat.map((t) => t.id));
  };

  const clearTsevetSelection = () => {
    setSelectedTsevetIds([]);
  };

  const value = {
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
    deleteTsevetData,
  };

  return (
    <TsevetMevatzeatContext.Provider value={value}>
      {children}
    </TsevetMevatzeatContext.Provider>
  );
}

export function useTsevetMevatzeat() {
  const context = useContext(TsevetMevatzeatContext);
  if (!context) throw new Error("useTsevetMevatzeat must be used within a TsevetMevatzeatProvider");
  return context;
}
