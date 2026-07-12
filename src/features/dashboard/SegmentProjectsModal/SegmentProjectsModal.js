import React, { useMemo, useState } from 'react';
import Modal from '../../../components/Modal/Modal';
import './SegmentProjectsModal.css';
import FilterBar from '../../projects/FilterBar/FilterBar';
import ProjectTable from '../../projects/ProjectTable/ProjectTable';
import { filterProjects, getProjectFilterOptions, DEFAULT_PROJECT_FILTERS } from '../../../utils/projectFilters';

export default function SegmentProjectsModal({ title, initialProjects, onClose }) {
  
  const [filters, setFilters] = useState(() => ({ ...DEFAULT_PROJECT_FILTERS }));

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters(() => ({ ...DEFAULT_PROJECT_FILTERS }));

  const filterOptions = useMemo(() => getProjectFilterOptions(initialProjects), [initialProjects]);

  const filtered = useMemo(() => filterProjects(initialProjects, filters), [initialProjects, filters]);

  return (
    <Modal onClose={onClose} maxWidth={980}>
      <div className="spm-root" dir="rtl">
        <div className="spm-header">
          <h3>{title}</h3>
        </div>

        <div className="spm-filters">
          <FilterBar
            filters={filters}
            filterOptions={filterOptions}
            updateFilter={updateFilter}
            clearFilters={clearFilters}
          />
        </div>

        <div className="spm-body">
          <div className="spm-count">נמצאו {filtered.length} פרויקטים</div>
          <ProjectTable projects={filtered} />
        </div>
      </div>
    </Modal>
  );
}
