import React from 'react';
import Modal from '../../../../../components/Modal/Modal';
import ProjectTable from '../../../../projects/ProjectTable/ProjectTable';
import './SectorProjectsModal.css';

export default function SectorProjectsModal({ sectorName, projects, onClose }) {
  return (
    <Modal onClose={onClose} maxWidth={900}>
      <div className="spm-card">
        <div className="spm-header">
          <div className="spm-title">פרויקטים באגף — {sectorName}</div>
          <button className="spm-close" onClick={onClose} aria-label="סגור">✕</button>
        </div>
        <div className="spm-body">
          <ProjectTable projects={projects} />
        </div>
      </div>
    </Modal>
  );
}
