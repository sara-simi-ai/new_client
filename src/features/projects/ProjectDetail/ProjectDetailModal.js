import React from 'react';
import Modal from '../../../components/Modal/Modal';
import ProjectDetail from './ProjectDetail';

export default function ProjectDetailModal({ project, onClose, maxWidth }) {
  if (!project) return null;

  return (
    <Modal onClose={onClose} maxWidth={maxWidth}>
      <ProjectDetail project={project} onClose={onClose} />
    </Modal>
  );
}
