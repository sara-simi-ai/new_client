import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  getAllTsevetMevatsea,
  insertTsevetMevatsea,
  updateTsevetMevatsea,
  toggleTsevetMevatseaActive,
} from "../api/tsevetMevatseaApi";

const TsevetMevatzeatContext = createContext();

// TsevetMevatsea.cs only has: IdntTsevetMevatsea (Guid), TsevetMevatseaName (string), Active (bool),
// serialized by ASP.NET Core as idntTsevetMevatsea / tsevetMevatseaName / active.
// Normalize once here and expose `id`/`name` aliases for the rest of the app.
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

  // NOTE: TsevetMevatseaController has no delete endpoint, only insert/get/update/toggle.
  // Deactivation is handled via toggleTsevetStatus below instead of deletion.

  const toggleTsevetStatus = async (id) => {
    const updated = await toggleTsevetMevatseaActive(id);
    const normalizedUpdated = normalizeTsevetMevatseaFromApi(updated);
    setTsevetMevatzeatList((prev) =>
      prev.map((t) => (t.id === normalizedUpdated.id ? normalizedUpdated : t))
    );
    return normalizedUpdated;
  };

  const selectedTsevetMevatzeat = useMemo(
    () => tsevetMevatzeatList.find((t) => t.id === selectedTsevetId) || null,
    [tsevetMevatzeatList, selectedTsevetId]
  );

  const toggleTsevetSelection = (tsevetId) => {
    setSelectedTsevetIds((prev) =>
      prev.includes(tsevetId) ? prev.filter((id) => id !== tsevetId) : [...prev, tsevetId]
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
    toggleTsevetStatus,
  };

  return (
    <TsevetMevatzeatContext.Provider value={value}>{children}</TsevetMevatzeatContext.Provider>
  );
}

export function useTsevetMevatzeat() {
  const context = useContext(TsevetMevatzeatContext);
  if (!context) throw new Error("useTsevetMevatzeat must be used within a TsevetMevatzeatProvider");
  return context;
}