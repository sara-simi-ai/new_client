import React, { useState } from 'react';
import './ContinuationDistributionDonut.css';
import { useProjects } from '../../../../services/context/ProjectsContext';
import { DASH_COLORS } from '../../constans/dashConstants';
import { computeProjectTotalBudget } from '../../../../utils/calculateProjectFinance';
import { formatMoney } from '../../../../utils/formatMoney';
import DonutChart from '../DonutChart/DonutChart';
import SegmentProjectsModal from '../../SegmentProjectsModal/SegmentProjectsModal';

export default function ContinuationVsNewBudgetDonut() {
  const { filteredProjects } = useProjects();
  const continuationBudgetTotal = filteredProjects
    .filter(project => Boolean(project.logHemsheci))
    .reduce((sum, project) => sum + computeProjectTotalBudget(project), 0);

  const newProjectsBudgetTotal = filteredProjects
    .filter(project => !Boolean(project.logHemsheci))
    .reduce((sum, project) => sum + computeProjectTotalBudget(project), 0);

  const chartSegments = [
    { value: continuationBudgetTotal, color: DASH_COLORS[0] },
    { value: newProjectsBudgetTotal,  color: DASH_COLORS[1] },
  ];

  const legendItems = [
    { label: 'המשכי', displayValue: `₪${formatMoney(continuationBudgetTotal)}`, color: DASH_COLORS[0] },
    { label: 'חדש',   displayValue: `₪${formatMoney(newProjectsBudgetTotal)}`,  color: DASH_COLORS[1] },
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const handleSegmentClick = (i) => {
    setModalIndex(i);
    setModalOpen(true);
  };

  const title = legendItems[modalIndex]?.label || 'פרויקטים';
  const modalList = filteredProjects.filter(p => modalIndex === 0 ? Boolean(p.logHemsheci) : !Boolean(p.logHemsheci));

  return (
    <div className="cdd-card">
      <div className="cdd-title">תקציב פרויקטים המשכיים VS חדשים</div>
      <DonutChart segments={chartSegments} items={legendItems} label="המשכי" onSegmentClick={handleSegmentClick} />

      {modalOpen && (
        <SegmentProjectsModal title={title} initialProjects={modalList} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
