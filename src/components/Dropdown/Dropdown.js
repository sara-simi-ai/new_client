import React, { useState, useRef } from 'react';
import { getOptionKey, getOptionLabel } from '../../utils/optionHelpers';
import { useClickOutside } from '../../utils/useClickOutside';
import './Dropdown.css';

export default function Dropdown({
  label,
  title,
  allLabel,
  options,
  selected,
  onChange,
  multi = false,
  valueToLabel,
  showAllOption = true,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, () => setOpen(false));

  const isSelected = (option) => {
    const optionKey = getOptionKey(option);

    if (optionKey === '__all__') {
      if (!Array.isArray(selected) || selected.length === 0) return false;

      const allItems = options.filter((o) => getOptionKey(o) !== '__all__');
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

      if (optionKey === '__all__') {
        const allItems = options.filter((o) => getOptionKey(o) !== '__all__');
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

      const allItems = options.filter((o) => getOptionKey(o) !== '__all__');
      const isAllSelected = allItems.length > 0 && allItems.every((item) =>
        values.some((s) => getOptionKey(s) === getOptionKey(item))
      );

      if (isAllSelected) return allLabel || label;
      return `נבחרו ${values.length}`;
    }

    if (selected === null || selected === undefined || selected === '') return allLabel || label;
    if (valueToLabel) return valueToLabel(selected);

    if (typeof selected === 'object') {
      return getOptionLabel(selected);
    }

    const selectedOption = options?.find((option) => getOptionKey(option) === selected);
    return selectedOption ? getOptionLabel(selectedOption) : selected;
  })();

  const hasSelection = multi
    ? (Array.isArray(selected) && selected.length > 0)
    : !(selected === null || selected === undefined || selected === '');

  return (
    <div className={`filter-dropdown ${className}`} ref={ref} dir="rtl">
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
            {!multi && showAllOption && (
              <div key="__all__" className="filter-option" onClick={() => handleSelect('')}>
                <span className="filter-option-text">{allLabel || label}</span>
              </div>
            )}

            {options?.map((option) => {
              const optionLabel = getOptionLabel(option);
              const optionKey = getOptionKey(option);

              if (!multi && optionKey === '__all__') return null;

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