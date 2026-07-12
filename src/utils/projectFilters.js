import { calculateProjectFinance } from "./calculateProjectFinance";
import { STATUS_PAAR_OPTIONS, AGAF_OPTIONS, YECHIDA_MEVATSAAT_OPTIONS } from "../dec/Dec";

export const DEFAULT_PROJECT_FILTERS = {
  search: "",
  agaff: [],
  yechidaMevatzat: [],
  maslol: "",
  logHemsheci: "",
  statusPearim: [],
};

export function getProjectFilterOptions(projects) {
  return {
    agaff: AGAF_OPTIONS,
    yechidaMevatzat: YECHIDA_MEVATSAAT_OPTIONS,
    statusPearim: STATUS_PAAR_OPTIONS,
  };
}

function matchesSearch(project, searchValue) {
  if (!searchValue) return true;
  const query = searchValue.toLowerCase();
  return [project.projectName, project.teur, project.agaff, project.yechidaMevatzat]
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

function matchesStatusPearim(project, selectedStatuses, getProjectStatus) {
  if (!selectedStatuses?.length) return true;
  const projectStatus = getProjectStatus(project);
  const selectedCodes = selectedStatuses.map((item) => item.value);
  return selectedCodes.includes(projectStatus);
}

export function filterProjects(projects, filters, getProjectStatus = (project) => calculateProjectFinance(project).statusPearim) {
  return projects.filter((project) => {
    if (!matchesSearch(project, filters.search)) return false;
    if (filters.agaff?.length && !filters.agaff.includes(project.agaff)) return false;
    if (filters.yechidaMevatzat?.length && !filters.yechidaMevatzat.includes(project.yechidaMevatzat)) return false;
    if (filters.maslol && String(project.maslol) !== String(filters.maslol)) return false;
    if (!matchesHemsheci(project, filters.logHemsheci)) return false;
    if (!matchesStatusPearim(project, filters.statusPearim, getProjectStatus)) return false;
    return true;
  });
}
