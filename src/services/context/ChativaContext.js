import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import {
  getAllChativa,
  insertChativa,
  updateChativa,
  toggleChativaActive,
} from "../api/chativaApi";

const ChativaContext = createContext();

function normalizeChativaFromApi(chativa) {
  return {
    ...chativa,
    id: chativa.idntChativa,
    name: chativa.chativaName || "",
    active: chativa.active ?? true,
  };
}

function normalizeChativaForApi(chativa) {
  return {
    idntChativa: chativa.id ?? chativa.idntChativa,
    chativaName: chativa.name ?? chativa.chativaName ?? "",
    active: chativa.active ?? true,
  };
}

export function ChativaProvider({ children }) {
  const [chativaList, setChativaList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChativaId, setSelectedChativaId] = useState(null);
  const [selectedChativaIds, setSelectedChativaIds] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    let mounted = true;
    async function fetchChativa() {
      setIsLoading(true);
      try {
        const data = await getAllChativa();
        const normalized = (data || []).map(normalizeChativaFromApi);
        if (!mounted) return;
        setChativaList(normalized);
        setSelectedChativaId(null);
      } catch (err) {
        console.error("שגיאה בטעינת חטיבות:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    fetchChativa();
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

  const filteredChativa = useMemo(() => {
    let result = chativaList;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((item) => item.name && item.name.toLowerCase().includes(searchLower));
    }

    if (filters.active !== undefined) {
      result = result.filter((item) => item.active === filters.active);
    }

    return result;
  }, [chativaList, filters]);

  const chativaOptions = useMemo(() => {
    return chativaList
      .filter((item) => item.active)
      .map((item) => ({
        value: item.id,
        label: item.name || "—",
      }));
  }, [chativaList]);

  const addNewChativa = useCallback(async (chativaData) => {
    const fullData = normalizeChativaForApi(chativaData);
    const savedChativa = await insertChativa(fullData);
    const normalizedSaved = normalizeChativaFromApi(savedChativa);
    setChativaList((prev) => [...prev, normalizedSaved]);
    return normalizedSaved;
  }, []);

  const updateChativaData = useCallback(async (chativaData) => {
    const toSend = normalizeChativaForApi(chativaData);
    const updated = await updateChativa(chativaData.id, toSend);
    const normalizedUpdated = normalizeChativaFromApi(updated);
    setChativaList((prev) =>
      prev.map((item) => (item.id === normalizedUpdated.id ? normalizedUpdated : item))
    );
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portfolio:metadataUpdated', { detail: { entity: 'chativa' } }));
    }
    return normalizedUpdated;
  }, []);

  const toggleChativaStatus = useCallback(async (id) => {
    const updated = await toggleChativaActive(id);
    const normalizedUpdated = normalizeChativaFromApi(updated);
    setChativaList((prev) =>
      prev.map((item) => (item.id === normalizedUpdated.id ? normalizedUpdated : item))
    );
    return normalizedUpdated;
  }, []);

  const selectedChativa = useMemo(
    () => chativaList.find((item) => item.id === selectedChativaId) || null,
    [chativaList, selectedChativaId]
  );

  const toggleChativaSelection = useCallback((chativaId) => {
    setSelectedChativaIds((prev) =>
      prev.includes(chativaId)
        ? prev.filter((id) => id !== chativaId)
        : [...prev, chativaId]
    );
  }, []);

  const selectAllFilteredChativa = useCallback(() => {
    setSelectedChativaIds(filteredChativa.map((item) => item.id));
  }, [filteredChativa]);

  const clearChativaSelection = useCallback(() => {
    setSelectedChativaIds([]);
  }, []);

  const value = useMemo(
    () => ({
      chativaList,
      filteredChativa,
      isLoading,
      selectedChativaId,
      setSelectedChativaId,
      selectedChativa,
      selectedChativaIds,
      toggleChativaSelection,
      selectAllFilteredChativa,
      clearChativaSelection,
      chativaOptions,
      filters,
      updateFilter,
      clearFilters,
      addNewChativa,
      updateChativaData,
      toggleChativaStatus,
    }),
    [
      chativaList,
      filteredChativa,
      isLoading,
      selectedChativaId,
      selectedChativa,
      selectedChativaIds,
      chativaOptions,
      filters,
      updateFilter,
      clearFilters,
      addNewChativa,
      updateChativaData,
      toggleChativaStatus,
      toggleChativaSelection,
      selectAllFilteredChativa,
      clearChativaSelection,
      setSelectedChativaId,
    ]
  );

  return <ChativaContext.Provider value={value}>{children}</ChativaContext.Provider>;
}

export function useChativa() {
  const context = useContext(ChativaContext);
  if (!context) throw new Error("useChativa must be used within a ChativaProvider");
  return context;
}
