import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  getAllProjects,
  getProjectByYear,
  insertProject,
  updateProject,
  deleteProject,
  copyProjectsFromPreviousYear,
  toggleProjectActive,
} from "../api/projectApi";
import { calculateProjectFinance } from "../../utils/calculateProjectFinanceHelper";
import { filterProjects, getProjectFilterOptions, DEFAULT_PROJECT_FILTERS } from "../../utils/projectFiltersHelper";

import { useAgaff } from "./AgaffContext";
import { useMachlaka } from "./MachlakaContext";
import { useChativa } from "./ChativaContext";
import ProjectDetailModal from '../../features/projects/ProjectDetail/ProjectDetailModal';

// Note: GlobalProjectModalHost removed; modal is rendered where needed (ProjectsList)

const ProjectsContext = createContext();

function normalizeProjectFromApi(project) {
  const totalTakzivCoachAdam = project.totalTakzivCoachAdam ?? 0;
  return {
    ...project,
    projectName: project.projectName || "",
    teur: project.teur || "",
    // Normalize server-side property names to the client-side expectations.
    // Server writes `agaffName` / `machlakaName` / `chativaName`; some client code expects
    // `agaff`, `yechidaMevatzat`, and `chativa` fields. Provide both to be compatible.
    agaff: project.agaff || project.agaffName || project.AgaffName || "",
    agaffName: project.agaffName || project.AgaffName || project.agaff || "",
    machlaka: project.machlaka || project.machlakaName || project.MachlakaName || "",
    machlakaName: project.machlakaName || project.MachlakaName || "",
    yechidaMevatzat: project.yechidaMevatzat || project.machlaka || project.machlakaName || project.MachlakaName || "",
    yechidaMevatzatName: project.yechidaMevatzat || project.machlakaName || project.MachlakaName || "",
    chativa: project.chativa || project.chativaName || project.ChativaName || "",
    chativaName: project.chativaName || project.ChativaName || project.chativa || "",
    totalTakzivCoachAdam,
  };
}

function normalizeProjectForApi(project) {
  const { active, createdAt, updatedAt, ...rest } = project;
  const totalTakzivCoachAdam = Number(rest.totalTakzivCoachAdam ?? 0);
  const result = {
    ...rest,
    totalTakzivCoachAdam,
    totalTakzivRechesh: Number(rest.totalTakzivRechesh || 0),
    coachAdam: Number(rest.coachAdam || 0),
  };

  // Preserve `active` when explicitly provided (important for updates).
  if (typeof active === "boolean") {
    result.active = active;
  }

  return result;
}

export function ProjectsProvider({ children, agaffOptions: propsAgaffOptions, yechidaMevatzatOptions: propsYechidaMevatzatOptions, chativaOptions: propsChativaOptions }) {
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("projects");
  const [viewMode, setViewMode] = useState("cards");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]); // for checkbox multi-select
  const [filters, setFilters] = useState(() => ({ ...DEFAULT_PROJECT_FILTERS }));

  // Use provided options or fallback to localStorage when available.
  const [agaffOptions] = useState(() => propsAgaffOptions || (() => {
    try {
      const saved = window.localStorage.getItem("agaffOptions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })());

  const [yechidaMevatzatOptions] = useState(() => propsYechidaMevatzatOptions || (() => {
    try {
      const saved = window.localStorage.getItem("yechidaMevatzatOptions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  })());

  const [chativaOptions] = useState(() => propsChativaOptions || []);

  // Update internal state when props change
  useEffect(() => {
    if (propsAgaffOptions) {
      // Options come from props, no need to update localStorage
    }
  }, [propsAgaffOptions]);

  useEffect(() => {
    if (propsYechidaMevatzatOptions) {
      // Options come from props, no need to update localStorage
    }
  }, [propsYechidaMevatzatOptions]);

  useEffect(() => {
    if (propsChativaOptions) {
      // Options come from props, no need to update localStorage
    }
  }, [propsChativaOptions]);

  const projectFinanceMap = useMemo(() => {
    const map = {};
    projects.forEach((p) => {
      map[p.id] = calculateProjectFinance(p);
    });
    return map;
  }, [projects]);

  useEffect(() => {
    let mounted = true;
    async function fetchProjects() {
      setIsLoading(true);
      try {
        const data = await getProjectByYear(selectedYear);
        const normalized = (data || []).map(normalizeProjectFromApi);
        if (!mounted) return;
        setProjects(normalized);
        setSelectedProjectId(null);
      } catch (err) {
        console.error("שגיאה בטעינת פרויקטים לשנה הנבחרת:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    fetchProjects();
    return () => {
      mounted = false;
    };
  }, [selectedYear]);

  const updateFilter = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const clearFilters = () => {
    setFilters(() => ({ ...DEFAULT_PROJECT_FILTERS }));
  };

  const filteredProjects = useMemo(() => {
    return filterProjects(
      projects,
      filters,
      (project) => projectFinanceMap[project.id]?.statusPearim || "takin",
      agaffOptions,
      chativaOptions,
      yechidaMevatzatOptions,
    );
  }, [projects, filters, projectFinanceMap, agaffOptions, chativaOptions, yechidaMevatzatOptions]);

  const projectOptions = useMemo(() => {
    // build project list based on current filters but excluding any selected project filter
    const filtersWithoutProject = { ...filters, project: [] };
    const available = filterProjects(
      projects,
      filtersWithoutProject,
      (project) => projectFinanceMap[project.id]?.statusPearim || "takin",
      agaffOptions,
      chativaOptions,
      yechidaMevatzatOptions,
    );

    return available.map((p) => ({ value: p.id, label: p.projectName || p.teur || "—" }));
  }, [projects, filters, projectFinanceMap, agaffOptions, chativaOptions, yechidaMevatzatOptions]);

  const filterOptions = useMemo(() => ({ ...getProjectFilterOptions(projects, agaffOptions, chativaOptions, yechidaMevatzatOptions), projects: projectOptions }), [projects, projectOptions, agaffOptions, chativaOptions, yechidaMevatzatOptions]);

  const gapDetails = useMemo(() => {
    return filteredProjects.map((p) => {
      const financeData = projectFinanceMap[p.id] || {};
      return {
        id: p.id,
        name: p.projectName || p.teur || "—",
        financeData,
      };
    });
  }, [filteredProjects, projectFinanceMap]);

  const summaryData = useMemo(() => {
    let totalHR = 0;
    let totalProc = 0;
    let totalGap = 0;

    filteredProjects.forEach((p) => {
      const financeData = projectFinanceMap[p.id] || {};
      totalHR += Number(financeData.totalTakzivCoachAdam ?? 0);
      totalProc += Number(financeData.totalTakzivRechesh ?? 0);
      totalGap += Number(financeData.pearim ?? 0);
    });

    return {
      totalCount: filteredProjects.length,
      totalActive: filteredProjects.length,
      totalHR,
      totalProc,
      totalBudget: totalHR + totalProc,
      totalGap,
    };
  }, [filteredProjects, projectFinanceMap]);

  const addNewProject = async (projectData) => {
    const withIds = {
      ...projectData,
      idntAgaff: projectData.agaff || projectData.idntAgaff || projectData.idntAgaff,
      idntMachlaka: projectData.yechidaMevatzat || projectData.idntMachlaka || projectData.idntTsevetMevatsea || projectData.idntMachlaka,
      idntChativa: projectData.chativa || projectData.idntChativa,
    };
    // Always create new projects as active by default.
    const fullData = normalizeProjectForApi({ ...withIds, year: selectedYear, active: true });
    const savedProject = await insertProject(fullData);
    const normalizedSaved = normalizeProjectFromApi(savedProject);
    setProjects((prev) => [...prev, normalizedSaved]);
    setAllProjects((prev) => [...prev, normalizedSaved]);
    return normalizedSaved;
  };

  const copyFromPreviousYear = async (year) => {
    const copied = await copyProjectsFromPreviousYear(year);
    const normalized = (copied || []).map(normalizeProjectFromApi);

    setProjects((prev) => [...prev, ...normalized]);
    setAllProjects((prev) => [...prev, ...normalized]);
    return normalized;
  };

  const syncProjectToCurrentYear = (prevProjects, project) => {
    if (project.year !== selectedYear) {
      return prevProjects;
    }

    if (project.active !== false) {
      const exists = prevProjects.some((p) => p.id === project.id);
      return exists
        ? prevProjects.map((p) => (p.id === project.id ? project : p))
        : [...prevProjects, project];
    }

    return prevProjects.filter((p) => p.id !== project.id);
  };

  const syncAllProjectsList = (prevProjects, project) => {
    const exists = prevProjects.some((p) => p.id === project.id);
    return exists
      ? prevProjects.map((p) => (p.id === project.id ? project : p))
      : [...prevProjects, project];
  };

  const updateProjectData = async (projectData) => {
    const withIds = {
      ...projectData,
      idntAgaff: projectData.agaff || projectData.idntAgaff,
      idntMachlaka: projectData.yechidaMevatzat || projectData.idntMachlaka || projectData.idntTsevetMevatsea,
      idntChativa: projectData.chativa || projectData.idntChativa,
    };
    // Ensure updates re-activate the project (active = true) per requirement.
    const toSend = normalizeProjectForApi({ ...withIds, active: true });
    const updated = await updateProject(toSend);
    const normalizedUpdated = normalizeProjectFromApi(updated);
    setProjects((prev) => syncProjectToCurrentYear(prev, normalizedUpdated));
    setAllProjects((prev) => syncAllProjectsList(prev, normalizedUpdated));
    return normalizedUpdated;
  };

  const loadAllProjects = async () => {
    setIsLoading(true);
    try {
      const data = await getAllProjects();
      const normalized = (data || []).map(normalizeProjectFromApi);
      setAllProjects(normalized);
      setSelectedProjectId(null);
      return normalized;
    } catch (err) {
      console.error("שגיאה בטעינת כל הפרויקטים:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProjectData = async (id) => {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setAllProjects((prev) => prev.filter((p) => p.id !== id));
    setSelectedProjectId((prev) => (prev === id ? null : prev));
    return id;
  };

  // Added: ProjectController exposes PATCH "toggleProjectActive/{id:guid}", but no
  // corresponding function previously existed on the context (the old projectApi
  // function pointed at a non-existent "/management/updateProjectActive" route).
  const toggleProjectStatus = async (id) => {
    const updated = await toggleProjectActive(id);
    const normalizedUpdated = normalizeProjectFromApi(updated);
    setProjects((prev) => syncProjectToCurrentYear(prev, normalizedUpdated));
    setAllProjects((prev) => syncAllProjectsList(prev, normalizedUpdated));
    return normalizedUpdated;
  };

  const selectedProject = useMemo(() => projects.find((p) => p.id === selectedProjectId) || null, [projects, selectedProjectId]);

  const toggleProjectSelection = (projectId) => {
    setSelectedProjectIds((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const selectAllFilteredProjects = () => {
    setSelectedProjectIds(filteredProjects.map((p) => p.id));
  };

  const clearProjectSelection = () => {
    setSelectedProjectIds([]);
  };

  const value = {
    projects,
    allProjects,
    filteredProjects,
    projectFinanceMap,
    summaryData,
    gapDetails,
    isLoading,
    selectedYear,
    setSelectedYear,
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    selectedProjectIds,
    toggleProjectSelection,
    selectAllFilteredProjects,
    clearProjectSelection,
    filters,
    filterOptions,
    updateFilter,
    clearFilters,
    addNewProject,
    updateProjectData,
    deleteProjectData,
    toggleProjectStatus,
    copyFromPreviousYear,
    loadAllProjects,
    agaffOptions,
    yechidaMevatzatOptions,
    chativaOptions,
  };

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) throw new Error("useProjects must be used within a ProjectsProvider");
  return context;
}

/**
 * Wrapper component that syncs Agaff and Tsevet Mevatzeat options with ProjectsProvider.
 * This component uses hooks to get the live options from AgaffContext and MachlakaContext,
 * then passes them to ProjectsProvider.
 */
export function ProjectsProviderWithSync({ children }) {
  const agaff = useAgaff();
  const machlaka = useMachlaka();
  const chativa = useChativa();

  // Convert options to the format ProjectsProvider expects.
  // agaff.agaffList / machlaka.machlakaList / chativa.chativaList items already carry
  // `id` / `name` aliases from their respective contexts.
  const agaffOptions = useMemo(() => {
    return (agaff.agaffList || []).map((item) => ({
      value: item.id,
      label: item.name || "—",
    }));
  }, [agaff.agaffList]);

  const yechidaMevatzatOptions = useMemo(() => {
    return (machlaka.machlakaList || []).map((item) => ({
      value: item.id,
      label: item.name || "—",
    }));
  }, [machlaka.machlakaList]);

  const chativaOptions = useMemo(() => {
    return (chativa.chativaList || []).map((item) => ({
      value: item.id,
      label: item.name || "—",
    }));
  }, [chativa.chativaList]);

  return (
    <ProjectsProvider
      agaffOptions={agaffOptions}
      yechidaMevatzatOptions={yechidaMevatzatOptions}
      chativaOptions={chativaOptions}
    >
      {children}
    </ProjectsProvider>
  );
}