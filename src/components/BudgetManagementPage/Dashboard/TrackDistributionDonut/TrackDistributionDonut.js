import React, { useState } from 'react';
import './TrackDistributionDonut.css';
import { useProjects } from '../../../../services/context/ProjectsContext';
import { MASLOL } from '../../../../constants/constants'; 
import { DASH_COLORS } from '../dashUtils/dashUtils';
import DonutChart from '../DonutChart/DonutChart';
import SegmentProjectsModal from '../SegmentProjectsModal/SegmentProjectsModal';

export default function MaslolTrackDistributionDonut() {
  const { projects } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const kiyumCount = projects.filter(project => project.maslol === MASLOL.KIYUM.value).length;
  const hitazmutCount = projects.filter(project => project.maslol === MASLOL.HITAZMUT.value).length;

  const chartSegments = [
    { value: kiyumCount, color: DASH_COLORS[0] },
    { value: hitazmutCount, color: DASH_COLORS[1] },
  ];

  const legendItems = [
    { label: MASLOL.KIYUM.label, color: DASH_COLORS[0] },
    { label: MASLOL.HITAZMUT.label, color: DASH_COLORS[1] },
  ];

  const handleSegmentClick = (i) => {
    setModalIndex(i);
    setModalOpen(true);
  };

  const modalTitle = legendItems[modalIndex]?.label || 'פרויקטים';
  const modalProjects = projects.filter((project) => { //========= CHANGED: named comparisons via MASLOL.KIYUM/MASLOL.HITAZMUT instead of index-based kiyumOption/hitazmutOption
    if (modalIndex === 0) return project.maslol === MASLOL.KIYUM.value;
    if (modalIndex === 1) return project.maslol === MASLOL.HITAZMUT.value;
    return Boolean(project.logHemsheci);
  });

  return (
    <div className="tdd-card">
      <div className="tdd-title">מסלול קיום / התעצמות</div>
      <DonutChart segments={chartSegments} items={legendItems} label="קיום" onSegmentClick={handleSegmentClick} />

      {modalOpen && (
        <SegmentProjectsModal title={modalTitle} initialProjects={modalProjects} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}