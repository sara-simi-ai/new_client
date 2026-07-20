import React, { useEffect, useRef, useState } from 'react';
import { useProjects } from '../../../services/context/ProjectsContext';
import './YearSelector.css';

const YearSelector = () => {
  const { selectedYear, setSelectedYear } = useProjects();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const now = new Date().getFullYear();
  const startYear = 2026;
  const years = [];
  for (let y = now + 1; y >= startYear; y--) {
    years.push(y);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (year) => {
    setSelectedYear(Number(year));
    setOpen(false);
  };

  return (
    <div className="ys-dropdown" ref={ref} dir="rtl">
      <button
        type="button"
        className="ys-button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="ys-button-value">{selectedYear ? `${selectedYear} תקציב` : 'בחר שנת תקציב'}</span>
        <span className="ys-button-arrow" aria-hidden="true" />
      </button>

      {open && (
        <div className="ys-popover" role="listbox">
          <div className="ys-options">
            {years.map((year) => (
              <div
                key={year}
                className={`ys-option${selectedYear === year ? ' ys-option-selected' : ''}`}
                onClick={() => handleSelect(year)}
                role="option"
                aria-selected={selectedYear === year}
              >
                <span className="ys-option-text">{year} תקציב</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default YearSelector;
