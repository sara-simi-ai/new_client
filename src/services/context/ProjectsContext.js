import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { getAllProjects, getProjectByYear, insertProject, updateProject, deleteProject, copyProjectsFromPreviousYear } from "../api/generalApi";
import { calculateProjectFinance } from "../../utils/calculateProjectFinance";
import { filterProjects, getProjectFilterOptions, DEFAULT_PROJECT_FILTERS } from "../../utils/projectFilters";

const ProjectsContext = createContext();


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
  const totalTakzivCoachAdam = Number(project.totalTakzivCoachAdam ?? 0);
  return {
    ...project,
    totalTakzivCoachAdam,
    totalTakzivRechesh: Number(project.totalTakzivRechesh || 0),
    coachAdam: Number(project.coachAdam || 0),
  };
}

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("projects");
  const [viewMode, setViewMode] = useState("cards");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [filters, setFilters] = useState(() => ({ ...DEFAULT_PROJECT_FILTERS }));

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
  
  const filterOptions = useMemo(() => getProjectFilterOptions(projects), [projects]);

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
    const fullData = normalizeProjectForApi({ ...projectData, year: selectedYear });
    const savedProject = await insertProject(fullData);
    const normalizedSaved = normalizeProjectFromApi(savedProject);
    setProjects((prev) => [...prev, normalizedSaved]);
    return normalizedSaved;
  };

    const copyFromPreviousYear = async (year) => {
    const copied = await copyProjectsFromPreviousYear(year);
    const normalized = (copied || []).map((p) => ({
      ...p,
      projectName: p.projectName || p.name || "",
      teur: p.teur || p.desc || "",
      totalTakzuvCoachAdam: p.totalTakzuvCoachAdam || 0,
      totalTakzivRechesh: p.totalTakzivRechesh || 0,
      coachAdam: p.coachAdam || 0,
    }));

    setProjects((prev) => [...prev, ...normalized]);
    return normalized;
  };

  const updateProjectData = async (projectData) => {
    const toSend = normalizeProjectForApi({ ...projectData });
    const updated = await updateProject(toSend);
    const normalizedUpdated = normalizeProjectFromApi(updated);
    setProjects((prev) => prev.map((p) => (p.id === normalizedUpdated.id ? normalizedUpdated : p)));
    return normalizedUpdated;
  };

  const loadAllProjects = async () => {
    setIsLoading(true);
    try {
      const data = await getAllProjects();
      const normalized = (data || []).map(normalizeProjectFromApi);
      setProjects(normalized);
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
    setSelectedProjectId((prev) => (prev === id ? null : prev));
    return id;
  };

  const selectedProject = useMemo(() => projects.find((p) => p.id === selectedProjectId) || null, [projects, selectedProjectId]);

  const value = {
    projects,
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
    filters,
    filterOptions,
    updateFilter,
    clearFilters,
    addNewProject,
    updateProjectData,
    deleteProjectData,
    copyFromPreviousYear
    ,
    loadAllProjects
  };

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) throw new Error("useProjects must be used within a ProjectsProvider");
  return context;
}