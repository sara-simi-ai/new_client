import React from "react";
import { useProjects } from "../../../services/context/ProjectsContext";
import { useAgaff } from "../../../services/context/AgaffContext";
import { useMachlaka } from "../../../services/context/MachlakaContext";
import { useChativa } from "../../../services/context/ChativaContext";
import { MASLOL_OPTIONS, CONTINUATION_LABEL, CONTINUATION_FALSE_LABEL, CONTINUATION_TRUE_LABEL } from "../../../utils/Dec";
import { getOptionLabelByValue } from "../../../utils/optionHelpers";
import Dropdown from "../../../components/Dropdown/Dropdown";
import "./FilterBar.css";

export default function FilterBar({
  filters: localFilters,
  filterOptions: localFilterOptions,
  updateFilter: localUpdateFilter,
  clearFilters: localClearFilters,
} = {}) {
  // Prefer local (modal) props when provided, otherwise fall back to global ProjectsContext
  const { filters: ctxFilters, filterOptions: ctxFilterOptions, updateFilter: ctxUpdateFilter, clearFilters: ctxClearFilters } = useProjects();
  const filters = localFilters ?? ctxFilters;
  const filterOptions = localFilterOptions ?? ctxFilterOptions;
  const updateFilter = localUpdateFilter ?? ctxUpdateFilter;
  const clearFilters = localClearFilters ?? ctxClearFilters;
  const { agaffOptions } = useAgaff();
  const { chativaOptions } = useChativa();
  const { machlakaOptions } = useMachlaka();
  const clearLabel = "נקה";

  const filtersList = [
    <Dropdown
      key="agaff"
      title="אגף"
      label="אגף"
      allLabel="כל האגפים"
      options={filterOptions?.agaff || agaffOptions}
      selected={filters.agaff || []}
      onChange={(next) => updateFilter("agaff", next)}
      multi={true}
    />,
    <Dropdown
      key="chativa"
      title="חטיבה"
      label="חטיבה"
      allLabel="כל החטיבות"
      options={filterOptions?.chativa || chativaOptions}
      selected={filters.chativa || []}
      onChange={(next) => updateFilter("chativa", next)}
      multi={true}
    />,
    <Dropdown
      key="yechidaMevatzat"
      title="מחלקה"
      label="מחלקה"
      allLabel="כל המחלקות"
      options={filterOptions?.yechidaMevatzat || machlakaOptions}
      selected={filters.yechidaMevatzat || []}
      onChange={(next) => updateFilter("yechidaMevatzat", next)}
      multi={true}
    />,
    <Dropdown
      key="maslol"
      title="מסלול"
      label="מסלול"
      allLabel="כל המסלולים"
      options={MASLOL_OPTIONS}
      selected={filters.maslol}
      onChange={(next) => updateFilter("maslol", next)}
      valueToLabel={(v) => getOptionLabelByValue(MASLOL_OPTIONS, v, "כל המסלולים")}
      multi={false}
    />,
    <Dropdown
      key="logHemsheci"
      title="סטטוס"
      label={CONTINUATION_LABEL}
      allLabel={CONTINUATION_LABEL}
      options={[{ value: 'yes', label: `${CONTINUATION_TRUE_LABEL}` }, { value: 'no', label: `${CONTINUATION_FALSE_LABEL}` }]}
      selected={filters.logHemsheci}
      onChange={(next) => updateFilter("logHemsheci", next)}
      valueToLabel={(v) => {
        if (!v) return CONTINUATION_LABEL;
        if (v === 'yes') return `${CONTINUATION_LABEL}: ${CONTINUATION_TRUE_LABEL}`;
        if (v === 'no') return `${CONTINUATION_LABEL}: ${CONTINUATION_FALSE_LABEL}`;
        return CONTINUATION_LABEL;
      }}
      multi={false}
    />,
    <Dropdown
      key="statusPearim"
      title="פערים"
      label="פערים"
      allLabel="כל הפערים"
      options={filterOptions?.statusPearim || []}
      selected={filters.statusPearim || []}
      onChange={(next) => updateFilter("statusPearim", next)}
      multi={true}
    />,
    <Dropdown
      key="project"
      title="פרויקט"
      label="פרויקט"
      allLabel="כל הפרויקטים"
      options={filterOptions?.projects || []}
      selected={filters.project || []}
      onChange={(next) => updateFilter("project", next)}
      multi={true}
    />,
  ];

  return (
    <div className="toolbar" dir="rtl">
      <div className="toolbar-main">
        <input
          type="text"
          placeholder="חפש שם, תיאור, אגף..."
          value={filters.search || ""}
          onChange={(e) => updateFilter("search", e.target.value)}
        />

        {filtersList}

        <button type="button" className="btn toolbar-clear-button" onClick={clearFilters}>
          {clearLabel}
        </button>
      </div>
    </div>
  );
}
