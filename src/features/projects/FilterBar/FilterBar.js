import React, { useState, useRef, useEffect } from "react";
import { useProjects } from "../../../services/context/ProjectsContext";
import {
  MASLOL_OPTIONS,
  CONTINUATION_LABEL,
  CONTINUATION_FALSE_LABEL,
  CONTINUATION_TRUE_LABEL,
} from "../../../utils/Dec";
import "./FilterBar.css";

const getOptionKey = (option) => (typeof option === "object" ? option.value : option);
const getOptionLabel = (option) => (typeof option === "object" ? option.label : option);

function useClickOutside(ref, onClose) {
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, onClose]);
}

function Dropdown({
  label,
  title,
  allLabel,
  options,
  selected,
  onChange,
  multi = false,
  valueToLabel,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, () => setOpen(false));

  const isSelected = (option) => {
    const optionKey = getOptionKey(option);
    
    if (optionKey === "__all__") {
      // "All" is considered selected if no items are selected OR if all non-"all" items are selected
      if (!Array.isArray(selected) || selected.length === 0) return false;
      
      const allItems = options.filter((o) => getOptionKey(o) !== "__all__");
      return allItems.every((item) =>
        selected.some((s) => getOptionKey(s) === getOptionKey(item))
      );
    }
    
    if (multi) {
      return Array.isArray(selected) && selected.some((item) => getOptionKey(item) === optionKey);
    }
    return selected === optionKey || selected === option;
  };

  const handleSelect = (option) => {
    if (multi) {
      const optionKey = getOptionKey(option);
      
      // Handle "all" option
      if (optionKey === "__all__") {
        // If all items are selected, clear them. Otherwise select all non-"all" items
        const allItems = options.filter((o) => getOptionKey(o) !== "__all__");
        const isCurrentlyAll =
          Array.isArray(selected) &&
          allItems.every((item) =>
            selected.some((s) => getOptionKey(s) === getOptionKey(item))
          );
        
        onChange(isCurrentlyAll ? [] : allItems);
        return;
      }
      
      const selectedArray = Array.isArray(selected) ? [...selected] : [];
      const next = selectedArray.some((item) => getOptionKey(item) === optionKey)
        ? selectedArray.filter((item) => getOptionKey(item) !== optionKey)
        : [...selectedArray, option];
      onChange(next);
      return;
    }

    onChange(getOptionKey(option));
    setOpen(false);
  };

  const displayValue = (() => {
    if (multi) {
      const values = Array.isArray(selected) ? selected : [];
      if (values.length === 0) return allLabel || label;
      
      // Check if all non-"all" items are selected
      const allItems = options.filter((o) => getOptionKey(o) !== "__all__");
      const isAllSelected = allItems.length > 0 && allItems.every((item) =>
        values.some((s) => getOptionKey(s) === getOptionKey(item))
      );
      
      if (isAllSelected) return allLabel || label;
      
      return `נבחרו ${values.length}`;
    }

    if (!selected || selected === "") return allLabel || label;
    if (valueToLabel) return valueToLabel(selected);
    return typeof selected === "object" ? getOptionLabel(selected) : selected;
  })();

  const hasSelection = multi 
    ? (Array.isArray(selected) && selected.length > 0)
    : (selected && selected !== "");

  return (
    <div className="filter-dropdown" ref={ref}>
      {title && hasSelection && <span className="filter-dropdown-title">{title}</span>}
      <button
        type="button"
        className="filter-button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="filter-button-value">{displayValue}</span>
        <span className="filter-button-arrow" aria-hidden="true" />
      </button>

      {open && (
        <div className="filter-popover" role="listbox">
          {multi && Array.isArray(selected) && selected.length > 0 && (
            <div className="filter-popover-header">
              <button type="button" className="btn" onClick={() => onChange([])}>
                נקה
              </button>
            </div>
          )}
          <div className="filter-options">
            {!multi && (
              <div key="__all__" className="filter-option" onClick={() => handleSelect("")}>
                <span className="filter-option-text">{allLabel || label}</span>
              </div>
            )}

            {options?.map((option) => {
              const optionLabel = getOptionLabel(option);
              const optionKey = getOptionKey(option);
              
              // Skip regular "all" rendering for string arrays (backwards compatibility)
              // Show "all" option for multi-select only if it has __all__ in the key
              if (!multi && optionKey === "__all__") return null;
              
              return (
                <div key={optionKey} className="filter-option" onClick={() => handleSelect(option)}>
                  {multi && (
                    <input
                      type="checkbox"
                      checked={isSelected(option)}
                      onChange={() => handleSelect(option)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                  <span className="filter-option-text">{optionLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FilterBar() {
  const { filters, filterOptions, updateFilter, clearFilters } = useProjects();

  return (
    <div className="toolbar" dir="rtl">
      <input
        type="text"
        placeholder="🔍  חפש שם, תיאור, אגף..."
        value={filters.search || ""}
        onChange={(e) => updateFilter("search", e.target.value)}
      />

      <Dropdown
        title="אגף"
        label="אגף"
        allLabel="כל האגפים"
        options={filterOptions.agaff}
        selected={filters.agaff || []}
        onChange={(next) => updateFilter("agaff", next)}
        multi={true}
      />

      <Dropdown
        title="מבוצע ע''י"
        label="מבוצע ע''י"
        allLabel="מבוצע ע''י"
        options={filterOptions.yechidaMevatzat}
        selected={filters.yechidaMevatzat || []}
        onChange={(next) => updateFilter("yechidaMevatzat", next)}
        multi={true}
      />

      <Dropdown
        title="מסלול"
        label="מסלול"
        allLabel="כל המסלולים"
        options={MASLOL_OPTIONS}
        selected={filters.maslol}
        onChange={(next) => updateFilter("maslol", next)}
        valueToLabel={(v) => {
          const found = MASLOL_OPTIONS.find((o) => o.value === v);
          return found ? found.label : "כל המסלולים";
        }}
        multi={false}
      />

      <Dropdown
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
      />

      <Dropdown
        title="פערים"
        label="פערים"
        allLabel="כל הפערים"
        options={filterOptions?.statusPearim || []}
        selected={filters.statusPearim || []}
        onChange={(next) => updateFilter("statusPearim", next)}
        multi={true}
      />

      <Dropdown
        title="פרויקט"
        label="פרויקט"
        allLabel="כל הפרויקטים"
        options={filterOptions?.projects || []}
        selected={filters.project}
        onChange={(next) => updateFilter("project", next)}
        valueToLabel={(v) => {
          const found = (filterOptions?.projects || []).find((o) => String(o.value) === String(v));
          return found ? found.label : "כל הפרויקטים";
        }}
        multi={false}
      />

      <button type="button" className="btn" onClick={clearFilters}>
        נקה הכל
      </button>
    </div>
  );
}