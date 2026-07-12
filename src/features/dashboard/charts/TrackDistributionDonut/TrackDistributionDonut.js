import React, { useState } from 'react';
import './TrackDistributionDonut.css';
import { useProjects } from '../../../../services/context/ProjectsContext';
import { MASLOL } from '../../../../dec/Dec.js';
import { DASH_COLORS } from '../../constans/dashConstants';
import DonutChart from '../DonutChart/DonutChart';
import SegmentProjectsModal from '../../SegmentProjectsModal/SegmentProjectsModal';

export default function MaslolTrackDistributionDonut() {
  const { filteredProjects } = useProjects();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const kiyumCount = filteredProjects.filter(project => project.maslol === MASLOL.KIYUM.value).length;
  const hitazmutCount = filteredProjects.filter(project => project.maslol === MASLOL.HITAZMUT.value).length;

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
  const modalProjects = filteredProjects.filter((project) => { 
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
