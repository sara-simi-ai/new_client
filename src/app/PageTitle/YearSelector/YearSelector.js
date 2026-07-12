import React from 'react';
import { useProjects } from '../../../services/context/ProjectsContext';
import './YearSelector.css';

const YearSelector = () => {
  const { selectedYear, setSelectedYear } = useProjects();
  const now = new Date().getFullYear();
  const startYear = 2026;
  const years = [];
  for (let y = now + 1; y >= startYear; y--) {
    years.push(y);
  }

  const onChange = (e) => {
    const y = Number(e.target.value);
    setSelectedYear(y);
  };

  return (
    <div className="ys-wrapper">
      <select
        value={selectedYear}
        onChange={onChange}
        className="ys-select"
        aria-label="בחר שנת תקציב"
      >
        {years.map(y => (
          <option key={y} value={y}>{y} תקציב</option>
        ))}
      </select>
    </div>
  );
};

export default YearSelector;
