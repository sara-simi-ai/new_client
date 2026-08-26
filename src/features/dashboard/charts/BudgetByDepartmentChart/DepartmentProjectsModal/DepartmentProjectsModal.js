import React from 'react';
import Modal from '../../../../../components/Modal/Modal';
import ProjectTable from '../../../../projects/ProjectTable/ProjectTable';
import './DepartmentProjectsModal.css';

export default function DepartmentProjectsModal({ departmentName, projects, onClose }) {
  return (
    <Modal onClose={onClose} maxWidth={900}>
      <div className="dpm-card">
        <div className="dpm-header">
          <div className="dpm-title">פרויקטים במחלקה — {departmentName}</div>
          <button className="dpm-close" onClick={onClose} aria-label="סגור">✕</button>
        </div>
        <div className="dpm-body">
          <ProjectTable projects={projects} />
        </div>
      </div>
    </Modal>
  );
}
