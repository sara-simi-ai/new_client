import { calculateProjectFinance } from "./calculateProjectFinanceHelper";
import { GAP_STATUS_OPTIONS } from "./Dec";

export const DEFAULT_PROJECT_FILTERS = {
  search: "",
  agaff: [],
  chativa: [],
  yechidaMevatzat: [],
  machlaka: [],
  project: [],
  maslol: "",
  logHemsheci: "",
  statusPearim: [],
};

const AGAFF_ALL_OPTION = { value: "__all__", label: "כל האגפים" };
const CHATIVA_ALL_OPTION = { value: "__all__", label: "כל החטיבות" };
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

export function getProjectFilterOptions(projects, agaffOptions = [], chativaOptions = [], yechidaMevatzatOptions = []) {
  // Prefer explicit options passed from provider (ids + labels). When not
  // provided, derive options from project documents using the server-side
  // denormalized name fields: `agaffName`, `chativaName`, and `machlakaName`.
  const effectiveAgaffOptions = (agaffOptions || []).length > 0
    ? agaffOptions
    : [AGAFF_ALL_OPTION, ...buildOptionsFromProjects(projects, "agaffName")];

  const effectiveChativaOptions = (chativaOptions || []).length > 0
    ? chativaOptions
    : [CHATIVA_ALL_OPTION, ...buildOptionsFromProjects(projects, "chativaName")];

  const effectiveYechidaOptions = (yechidaMevatzatOptions || []).length > 0
    ? yechidaMevatzatOptions
    : [YECHIDA_ALL_OPTION, ...buildOptionsFromProjects(projects, "machlakaName")];

  return {
    agaff: effectiveAgaffOptions,
    chativa: effectiveChativaOptions,
    yechidaMevatzat: effectiveYechidaOptions,
    machlaka: effectiveYechidaOptions,
    statusPearim: GAP_STATUS_OPTIONS,
  };
}

function matchesSearch(project, searchValue) {
  if (!searchValue) return true;
  const query = searchValue.toLowerCase();
  return [project.projectName, project.teur, project.agaffName || project.AgaffName || project.agaff, project.chativaName || project.ChativaName || project.chativa, project.machlakaName || project.MachlakaName ]
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
  chativaOptions = [],
  yechidaMevatzatOptions = []
) {
  const effectiveAgaffOptions = (agaffOptions || []).length > 0
    ? agaffOptions
    : buildOptionsFromProjects(projects, "agaff");

  const effectiveChativaOptions = (chativaOptions || []).length > 0
    ? chativaOptions
    : buildOptionsFromProjects(projects, "chativa");

  const effectiveYechidaOptions = (yechidaMevatzatOptions || []).length > 0
    ? yechidaMevatzatOptions
    : buildOptionsFromProjects(projects, "yechidaMevatzat");

  return projects.filter((project) => {
    if (!matchesSearch(project, filters.search)) return false;
    
    // For agaff: if not empty and not all selected, filter by matching either
    // agaff name or agaff id (options may be ids from AgaffContext or names derived from projects).
    const agaffFilter = Array.isArray(filters.agaff) ? filters.agaff : [];
    const agaffItems = effectiveAgaffOptions.filter((o) => (o.value || o) !== "__all__");
    const isAgaffAllSelected = isAllItemsSelected(agaffFilter, agaffItems);
    if (agaffFilter.length && !isAgaffAllSelected) {
      const agaffValues = agaffFilter.map((a) => String(a.value ?? a));

      const projectAgaffCandidates = [
        project.agaffName || project.AgaffName || project.agaff,
        project.agaff || project.AgaffName || project.agaffName,
        project.idntAgaff || project.idntAgaff,
      ]
        .filter(Boolean)
        .map(String);

      const match = agaffValues.some((v) => projectAgaffCandidates.includes(v));
      if (!match) return false;
    }
    
    // For chativa: if not empty and not all selected, filter by matching either
    // chativa name or chativa id (options may be ids from ChativaContext or names derived from projects).
    const chativaFilter = Array.isArray(filters.chativa) ? filters.chativa : [];
    const chativaItems = effectiveChativaOptions.filter((o) => (o.value || o) !== "__all__");
    const isChativaAllSelected = isAllItemsSelected(chativaFilter, chativaItems);
    if (chativaFilter.length && !isChativaAllSelected) {
      const chativaValues = chativaFilter.map((c) => String(c.value ?? c));

      const projectChativaCandidates = [
        project.chativaName || project.ChativaName || project.chativa,
        project.chativa || project.chativaName || project.ChativaName,
        project.idntChativa || project.idntChativa,
      ]
        .filter(Boolean)
        .map(String);

      const match = chativaValues.some((v) => projectChativaCandidates.includes(v));
      if (!match) return false;
    }
    
    // For yechidaMevatzat: if not empty and not all selected, filter by matching
    // either the machlaka name or machlaka id (some options are ids, others are names).
    // Accept either `yechidaMevatzat` or legacy/alternate `machlaka` key.
    const yechidaFilter = Array.isArray(filters.yechidaMevatzat)
      ? filters.yechidaMevatzat
      : Array.isArray(filters.machlaka)
      ? filters.machlaka
      : [];
    const yechidaItems = effectiveYechidaOptions.filter((o) => (o.value || o) !== "__all__");
    const isYechidaAllSelected = isAllItemsSelected(yechidaFilter, yechidaItems);
    if (yechidaFilter.length && !isYechidaAllSelected) {
      // Build a set of selected ids/names and include option labels when
      // options are id-based (so matching can succeed against project name).
      const yechidaValuesSet = new Set();
      yechidaFilter.forEach((y) => {
        const key = String(y.value ?? y);
        yechidaValuesSet.add(key);
        const opt = effectiveYechidaOptions.find((o) => String(o.value ?? o) === key);
        if (opt) {
          yechidaValuesSet.add(String(opt.label ?? opt.value ?? key));
        }
      });
      const yechidaValues = Array.from(yechidaValuesSet);

      const projectYechidaCandidates = [
        project.machlakaName,
        project.MachlakaName,
        project.machlaka,
        project.Machlaka,
        project.yechidaMevatzat,
        project.idntMachlaka,
        project.idntTsevetMevatsea,
        project.IdntMachlaka,
      ]
        .filter(Boolean)
        .map((s) => String(s).toLowerCase());

      const yechidaValuesNormalized = yechidaValues.map((v) => String(v).toLowerCase());
      const match = yechidaValuesNormalized.some((v) => projectYechidaCandidates.includes(v));
      if (!match) return false;
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
