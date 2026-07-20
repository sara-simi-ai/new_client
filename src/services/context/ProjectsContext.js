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
import { AGAF_OPTIONS, YECHIDA_MEVATSAAT_OPTIONS } from "../../utils/Dec";
import { useAgaff } from "./AgaffContext";
import { useTsevetMevatzeat } from "./TsevetMevatzeatContext";

const ProjectsContext = createContext();

// Project.cs fields (PascalCase) are serialized by ASP.NET Core as camelCase JSON:
// id, idntAgaff, agaffName, idntTsevetMevatsea, tsevetMevatseaName, projectName, teur,
// maslol, idntMaslol, logHemsheci, totalTakzivCoachAdam, totalTakzivRechesh, coachAdam,
// hearot, active, year, createdAt, updatedAt. These already line up with the field names
// used below, so only numeric coercion / defaults are normalized here.
function normalizeProjectFromApi(project) {
  const totalTakzivCoachAdam = project.totalTakzivCoachAdam ?? 0;
  return {
    ...project,
    projectName: project.projectName || "",
    teur: project.teur || "",
    totalTakzivCoachAdam,
  };
}

function normalizeProjectForApi(project) {
  const { active, createdAt, updatedAt, ...rest } = project;
  const totalTakzivCoachAdam = Number(rest.totalTakzivCoachAdam ?? 0);
  return {
    ...rest,
    totalTakzivCoachAdam,
    totalTakzivRechesh: Number(rest.totalTakzivRechesh || 0),
    coachAdam: Number(rest.coachAdam || 0),
  };
}

export function ProjectsProvider({ children, agaffOptions: propsAgaffOptions, yechidaMevatzatOptions: propsYechidaMevatzatOptions }) {
  const [projects, setProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("projects");
  const [viewMode, setViewMode] = useState("cards");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]); // for checkbox multi-select
  const [filters, setFilters] = useState(() => ({ ...DEFAULT_PROJECT_FILTERS }));

  // Use provided options or fallback to localStorage
  const [agaffOptions] = useState(() => propsAgaffOptions || (() => {
    try {
      const saved = window.localStorage.getItem("agaffOptions");
      return saved ? JSON.parse(saved) : AGAF_OPTIONS;
    } catch {
      return AGAF_OPTIONS;
    }
  })());

  const [yechidaMevatzatOptions] = useState(() => propsYechidaMevatzatOptions || (() => {
    try {
      const saved = window.localStorage.getItem("yechidaMevatzatOptions");
      return saved ? JSON.parse(saved) : YECHIDA_MEVATSAAT_OPTIONS;
    } catch {
      return YECHIDA_MEVATSAAT_OPTIONS;
    }
  })());

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
      (project) => projectFinanceMap[project.id]?.statusPearim || "takin"
    );
  }, [projects, filters, projectFinanceMap]);

  const projectOptions = useMemo(() => {
    // build project list based on current filters but excluding any selected project filter
    const filtersWithoutProject = { ...filters, project: [] };
    const available = filterProjects(
      projects,
      filtersWithoutProject,
      (project) => projectFinanceMap[project.id]?.statusPearim || "takin"
    );
    const items = available.map((p) => ({ value: p.id, label: p.projectName || p.teur || "—" }));
    return [{ value: "__all__", label: "כל הפרויקטים" }, ...items];
  }, [projects, filters, projectFinanceMap]);

  const filterOptions = useMemo(() => ({ ...getProjectFilterOptions(projects, agaffOptions, yechidaMevatzatOptions), projects: projectOptions }), [projects, projectOptions, agaffOptions, yechidaMevatzatOptions]);

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
      totalHR += financeData.totalTakzivCoachAdam || 0;
      totalProc += financeData.totalTakzivRechesh || 0;
      totalGap += financeData.pearim || 0;
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
    // Ensure we include the underlying agaff/tsevet IDs expected by the API.
    const withIds = {
      ...projectData,
      idntAgaff: projectData.agaff || projectData.idntAgaff || projectData.idntAgaff,
      idntTsevetMevatsea: projectData.yechidaMevatzat || projectData.idntTsevetMevatsea || projectData.idntTsevetMevatsea,
    };
    const fullData = normalizeProjectForApi({ ...withIds, year: selectedYear });
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
    return normalized;
  };

  const updateProjectData = async (projectData) => {
    // Map selected option values to the API's expected id fields.
    const withIds = {
      ...projectData,
      idntAgaff: projectData.agaff || projectData.idntAgaff,
      idntTsevetMevatsea: projectData.yechidaMevatzat || projectData.idntTsevetMevatsea,
    };
    const toSend = normalizeProjectForApi({ ...withIds });
    const updated = await updateProject(toSend);
    const normalizedUpdated = normalizeProjectFromApi(updated);
    setProjects((prev) => prev.map((p) => (p.id === normalizedUpdated.id ? normalizedUpdated : p)));
    setAllProjects((prev) => prev.map((p) => (p.id === normalizedUpdated.id ? normalizedUpdated : p)));
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
    setProjects((prev) => prev.map((p) => (p.id === normalizedUpdated.id ? normalizedUpdated : p)));
    setAllProjects((prev) => prev.map((p) => (p.id === normalizedUpdated.id ? normalizedUpdated : p)));
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
 * This component uses hooks to get the live options from AgaffContext and TsevetMevatzeatContext,
 * then passes them to ProjectsProvider.
 */
export function ProjectsProviderWithSync({ children }) {
  const agaff = useAgaff();
  const tsevet = useTsevetMevatzeat();

  // Convert options to the format ProjectsProvider expects.
  // agaff.agaffList / tsevet.tsevetMevatzeatList items already carry `id`/`name`
  // aliases from their respective contexts' normalizeFromApi functions.
  const agaffOptions = useMemo(() => {
    return (agaff.agaffList || []).map((item) => ({
      value: item.id,
      label: item.name || "—",
    }));
  }, [agaff.agaffList]);

  const yechidaMevatzatOptions = useMemo(() => {
    return (tsevet.tsevetMevatzeatList || []).map((item) => ({
      value: item.id,
      label: item.name || "—",
    }));
  }, [tsevet.tsevetMevatzeatList]);

  return (
    <ProjectsProvider
      agaffOptions={agaffOptions}
      yechidaMevatzatOptions={yechidaMevatzatOptions}
    >
      {children}
    </ProjectsProvider>
  );
}