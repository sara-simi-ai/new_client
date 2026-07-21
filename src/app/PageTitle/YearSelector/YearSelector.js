import React, { useMemo } from 'react';
import { useProjects } from '../../../services/context/ProjectsContext';
import Dropdown from '../../../components/Dropdown/Dropdown';
import './YearSelector.css';

const YearSelector = () => {
  const { selectedYear, setSelectedYear } = useProjects();

  const now = new Date().getFullYear();
  const startYear = 2026;
  const years = useMemo(() => {
    const list = [];
    for (let y = now + 1; y >= startYear; y--) {
      list.push({ value: y, label: `${y} תקציב` });
    }
    return list;
  }, [now]);

  return (
    <Dropdown
      label="בחר שנת תקציב"
      allLabel="בחר שנת תקציב"
      options={years}
      selected={selectedYear || ''}
      onChange={(next) => setSelectedYear(Number(next))}
      valueToLabel={(v) => (v ? `${v} תקציב` : 'בחר שנת תקציב')}
      multi={false}
      showAllOption={false}
    />
  );
};

export default YearSelector;
