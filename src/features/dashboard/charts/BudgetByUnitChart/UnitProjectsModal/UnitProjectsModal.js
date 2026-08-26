import React from 'react';
import Modal from '../../../../../components/Modal/Modal';
import ProjectTable from '../../../../projects/ProjectTable/ProjectTable';
import './UnitProjectsModal.css';

export default function UnitProjectsModal({ unitName, projects, onClose }) {
  return (
    <Modal onClose={onClose} maxWidth={900}>
      <div className="upm-card">
        <div className="upm-header">
          <div className="upm-title">פרויקטים בחטיבה — {unitName}</div>
          <button className="upm-close" onClick={onClose} aria-label="סגור">✕</button>
        </div>
        <div className="upm-body">
          <ProjectTable projects={projects} />
        </div>
      </div>
    </Modal>
  );
}
