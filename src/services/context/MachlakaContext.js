import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import {
  getAllMachlaka,
  insertMachlaka,
  updateMachlaka,
  toggleMachlakaActive,
} from "../api/machlakaApi";

const MachlakaContext = createContext();

function normalizeMachlakaFromApi(machlaka) {
  return {
    ...machlaka,
    id: machlaka.idntMachlaka,
    name: machlaka.machlakaName || "",
    active: machlaka.active ?? true,
  };
}

function normalizeMachlakaForApi(machlaka) {
  return {
    idntMachlaka: machlaka.id ?? machlaka.idntMachlaka,
    machlakaName: machlaka.name ?? machlaka.machlakaName ?? "",
    active: machlaka.active ?? true,
  };
}

export function MachlakaProvider({ children }) {
  const [machlakaList, setMachlakaList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMachlakaId, setSelectedMachlakaId] = useState(null);
  const [selectedMachlakaIds, setSelectedMachlakaIds] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    let mounted = true;
    async function fetchMachlaka() {
      setIsLoading(true);
      try {
        const data = await getAllMachlaka();
        const normalized = (data || []).map(normalizeMachlakaFromApi);
        if (!mounted) return;
        setMachlakaList(normalized);
        setSelectedMachlakaId(null);
      } catch (err) {
        console.error("שגיאה בטעינת מקצועות:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    fetchMachlaka();
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

  const filteredMachlaka = useMemo(() => {
    let result = machlakaList;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((t) => t.name && t.name.toLowerCase().includes(searchLower));
    }

    if (filters.active !== undefined) {
      result = result.filter((t) => t.active === filters.active);
    }

    return result;
  }, [machlakaList, filters]);

  const machlakaOptions = useMemo(() => {
    return machlakaList
      .filter((t) => t.active)
      .map((t) => ({
        value: t.id,
        label: t.name || "—",
      }));
  }, [machlakaList]);

  const addNewMachlaka = useCallback(async (machlakaData) => {
    const fullData = normalizeMachlakaForApi(machlakaData);
    const savedMachlaka = await insertMachlaka(fullData);
    const normalizedSaved = normalizeMachlakaFromApi(savedMachlaka);
    setMachlakaList((prev) => [...prev, normalizedSaved]);
    return normalizedSaved;
  }, []);

  const updateMachlakaData = useCallback(async (machlakaData) => {
    const toSend = normalizeMachlakaForApi(machlakaData);
    const updated = await updateMachlaka(machlakaData.id, toSend);
    const normalizedUpdated = normalizeMachlakaFromApi(updated);
    setMachlakaList((prev) =>
      prev.map((t) => (t.id === normalizedUpdated.id ? normalizedUpdated : t))
    );
    return normalizedUpdated;
  }, []);

  const toggleMachlakaStatus = useCallback(async (id) => {
    const updated = await toggleMachlakaActive(id);
    const normalizedUpdated = normalizeMachlakaFromApi(updated);
    setMachlakaList((prev) =>
      prev.map((t) => (t.id === normalizedUpdated.id ? normalizedUpdated : t))
    );
    return normalizedUpdated;
  }, []);

  const selectedMachlaka = useMemo(
    () => machlakaList.find((t) => t.id === selectedMachlakaId) || null,
    [machlakaList, selectedMachlakaId]
  );

  const toggleMachlakaSelection = useCallback((machlakaId) => {
    setSelectedMachlakaIds((prev) =>
      prev.includes(machlakaId) ? prev.filter((id) => id !== machlakaId) : [...prev, machlakaId]
    );
  }, []);

  const selectAllFilteredMachlaka = useCallback(() => {
    setSelectedMachlakaIds(filteredMachlaka.map((t) => t.id));
  }, [filteredMachlaka]);

  const clearMachlakaSelection = useCallback(() => {
    setSelectedMachlakaIds([]);
  }, []);

  const value = useMemo(
    () => ({
      machlakaList,
      filteredMachlaka,
      isLoading,
      selectedMachlakaId,
      setSelectedMachlakaId,
      selectedMachlaka,
      selectedMachlakaIds,
      toggleMachlakaSelection,
      selectAllFilteredMachlaka,
      clearMachlakaSelection,
      machlakaOptions,
      filters,
      updateFilter,
      clearFilters,
      addNewMachlaka,
      updateMachlakaData,
      toggleMachlakaStatus,
    }),
    [
      machlakaList,
      filteredMachlaka,
      isLoading,
      selectedMachlakaId,
      selectedMachlaka,
      selectedMachlakaIds,
      machlakaOptions,
      filters,
      updateFilter,
      clearFilters,
      addNewMachlaka,
      updateMachlakaData,
      toggleMachlakaStatus,
      toggleMachlakaSelection,
      selectAllFilteredMachlaka,
      clearMachlakaSelection,
      setSelectedMachlakaId,
    ],
  );

  return (
    <MachlakaContext.Provider value={value}>{children}</MachlakaContext.Provider>
  );
}

export function useMachlaka() {
  const context = useContext(MachlakaContext);
  if (!context) throw new Error("useMachlaka must be used within a MachlakaProvider");
  return context;
}