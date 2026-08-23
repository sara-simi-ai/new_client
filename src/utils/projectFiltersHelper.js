import { calculateProjectFinance } from "./calculateProjectFinanceHelper";
import { GAP_STATUS_OPTIONS } from "./Dec";

export const DEFAULT_PROJECT_FILTERS = {
  search: "",
  agaff: [],
  yechidaMevatzat: [],
  project: [],
  maslol: "",
  logHemsheci: "",
  statusPearim: [],
};

const AGAFF_ALL_OPTION = { value: "__all__", label: "כל האגפים" };
const YECHIDA_ALL_OPTION = { value: "__all__", label: "כל יחידות המבצעות" };

function buildOptionsFromProjects(projects, field) {
  const optionsMap = new Map();
  (projects || []).forEach((project) => {
    const value = project?.[field];
    if (value === undefined || value === null || value === "__all__") return;
    const key = String(value);
    if (!optionsMap.has(key)) {
      optionsMap.set(key, { value, label: String(value) });
    }
  });
  return Array.from(optionsMap.values());
}

// Helper function to check if all non-"all" items are selected
function isAllItemsSelected(selected, allOptions) {
  if (!Array.isArray(selected) || selected.length === 0) return false;
  const actualItems = allOptions.filter((o) => (o.value || o) !== "__all__");
  return actualItems.every((item) =>
    selected.some((s) => (s.value || s) === (item.value || item))
  );
}

export function getProjectFilterOptions(projects, agaffOptions = [], yechidaMevatzatOptions = []) {
  // Prefer explicit options passed from provider (ids + labels). When not
  // provided, derive options from project documents using the server-side
  // denormalized name fields: `agaffName` and `tsevetMevatseaName`.
  const effectiveAgaffOptions = (agaffOptions || []).length > 0
    ? agaffOptions
    : [AGAFF_ALL_OPTION, ...buildOptionsFromProjects(projects, "agaffName")];

  const effectiveYechidaOptions = (yechidaMevatzatOptions || []).length > 0
    ? yechidaMevatzatOptions
    : [YECHIDA_ALL_OPTION, ...buildOptionsFromProjects(projects, "tsevetMevatseaName")];

  return {
    agaff: effectiveAgaffOptions,
    yechidaMevatzat: effectiveYechidaOptions,
    statusPearim: GAP_STATUS_OPTIONS,
  };
}

function matchesSearch(project, searchValue) {
  if (!searchValue) return true;
  const query = searchValue.toLowerCase();
  return [project.projectName, project.teur, project.agaffName || project.AgaffName || project.agaff, project.tsevetMevatseaName || project.TsevetMevatseaName || project.yechidaMevatzat]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(query));
}

function matchesHemsheci(project, value) {
  if (!value) return true;
  const isCont = Boolean(project.logHemsheci);
  if (value === "yes") return isCont;
  if (value === "no") return !isCont;
  return true;
}

function matchesStatusPearim(project, selectedStatuses, getProjectStatus, isAllSelected = false) {
  if (!selectedStatuses?.length || isAllSelected) return true;
  const projectStatus = getProjectStatus(project);
  const selectedCodes = selectedStatuses.map((item) => item.value || item);
  return selectedCodes.includes(projectStatus);
}

export function filterProjects(
  projects,
  filters,
  getProjectStatus = (project) => calculateProjectFinance(project).statusPearim,
  agaffOptions = [],
  yechidaMevatzatOptions = []
) {
  const effectiveAgaffOptions = (agaffOptions || []).length > 0
    ? agaffOptions
    : buildOptionsFromProjects(projects, "agaff");

  const effectiveYechidaOptions = (yechidaMevatzatOptions || []).length > 0
    ? yechidaMevatzatOptions
    : buildOptionsFromProjects(projects, "yechidaMevatzat");

  return projects.filter((project) => {
    if (!matchesSearch(project, filters.search)) return false;
    
    // For agaff: if not empty and all items not selected, filter by agaff
    const agaffFilter = Array.isArray(filters.agaff) ? filters.agaff : [];
    const agaffItems = effectiveAgaffOptions.filter((o) => (o.value || o) !== "__all__");
    const isAgaffAllSelected = isAllItemsSelected(agaffFilter, agaffItems);
    if (agaffFilter.length && !isAgaffAllSelected) {
      const agaffValues = agaffFilter.map((a) => a.value || a);
      if (!agaffValues.includes(project.agaffName || project.AgaffName || project.agaff)) return false;
    }
    
    // For yechidaMevatzat: if not empty and all items not selected, filter by yechidaMevatzat
    const yechidaFilter = Array.isArray(filters.yechidaMevatzat) ? filters.yechidaMevatzat : [];
    const yechidaItems = effectiveYechidaOptions.filter((o) => (o.value || o) !== "__all__");
    const isYechidaAllSelected = isAllItemsSelected(yechidaFilter, yechidaItems);
    if (yechidaFilter.length && !isYechidaAllSelected) {
      const yechidaValues = yechidaFilter.map((y) => y.value || y);
      if (!yechidaValues.includes(project.tsevetMevatseaName || project.TsevetMevatseaName || project.yechidaMevatzat)) return false;
    }
    
    const projectFilter = Array.isArray(filters.project) ? filters.project : [];
    if (projectFilter.length) {
      const projectValues = projectFilter.map((item) => item.value || item);
      if (!projectValues.some((val) => String(val) === String(project.id))) return false;
    }

    if (filters.maslol && String(project.maslol) !== String(filters.maslol)) return false;
    if (!matchesHemsheci(project, filters.logHemsheci)) return false;
    
    // For statusPearim: if not empty and all items not selected, filter by status
    const statusFilter = Array.isArray(filters.statusPearim) ? filters.statusPearim : [];
    const statusItems = GAP_STATUS_OPTIONS.filter((o) => o.value !== "__all__");
    const isStatusAllSelected = isAllItemsSelected(statusFilter, statusItems);
    if (!matchesStatusPearim(project, statusFilter, getProjectStatus, isStatusAllSelected)) return false;
    
    return true;
  });
}
