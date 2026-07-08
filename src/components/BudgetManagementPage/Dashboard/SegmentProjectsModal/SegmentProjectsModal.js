import React, { useMemo, useState } from 'react';
import Modal from '../../Modal/Modal';
import './SegmentProjectsModal.css';
import FilterBar from '../../FilterBar/FilterBar';
import ProjectTable from '../../ProjectTable/ProjectTable';
import { calculateProjectFinance } from '../../../../utils/calculateProjectFinance';
import { STATUS_PAAR, STATUS_PEARIM_MAP } from '../../../../constants/constants';

const EMPTY_FILTERS = { search: '', agaff: [], yechidaMevatzat: [], maslol: '', logHemsheci: '', statusPearim: [] };

export default function SegmentProjectsModal({ title, initialProjects, onClose }) {
  // Local-only filter state: changing filters here must never touch the
  // app-wide ProjectsContext filters.
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  const filterOptions = useMemo(() => {
    const agaffSet = new Set();
    const yechidaSet = new Set();
    initialProjects.forEach((p) => {
      if (p.agaff) agaffSet.add(p.agaff);
      if (p.yechidaMevatzat) yechidaSet.add(p.yechidaMevatzat);
    });
    return {
      agaff: Array.from(agaffSet),
      yechidaMevatzat: Array.from(yechidaSet),
      statusPearim: ["אין פער", "פער בפלוס", "פער במינוס"],
    };
  }, [initialProjects]);

  const filtered = useMemo(() => {
    return initialProjects.filter((p) => {
      if (filters.search && !p.projectName?.toLowerCase().includes(filters.search.toLowerCase())) return false;

      if (filters.agaff?.length && !filters.agaff.includes(p.agaff)) return false;

      if (filters.yechidaMevatzat?.length && !filters.yechidaMevatzat.includes(p.yechidaMevatzat)) return false;

      if (filters.maslol && p.maslol !== filters.maslol) return false;

      if (filters.logHemsheci) {
        const isCont = Boolean(p.logHemsheci);
        if (filters.logHemsheci === 'yes' && !isCont) return false;
        if (filters.logHemsheci === 'no' && isCont) return false;
      }

      if (filters.statusPearim?.length > 0) {
        const projectStatus = calculateProjectFinance(p)?.statusPearim || STATUS_PAAR.TAKIN;
        const selectedStatuses = filters.statusPearim.map(name => STATUS_PEARIM_MAP[name]);
        if (!selectedStatuses.includes(projectStatus)) return false;
      }

      return true;
    });
  }, [initialProjects, filters]);

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
