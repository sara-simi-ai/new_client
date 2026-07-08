import React from 'react';
import Modal from '../BudgetManagementPage/Modal/Modal';
import ProjectDetail from '../BudgetManagementPage/ProjectDetail/ProjectDetail';

export default function ProjectDetailModal({ project, onClose, maxWidth }) {
  if (!project) return null;

  return (
    <Modal onClose={onClose} maxWidth={maxWidth}>
      <ProjectDetail project={project} onClose={onClose} />
    </Modal>
  );
}
