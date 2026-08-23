import React from 'react';
import Modal from '../../../components/Modal/Modal';
import ProjectDetail from './ProjectDetail';
import ProjectFormModal from '../ProjectFormModal/ProjectFormModal';
import { useProjectActions } from '../hooks/useProjectActions';

export default function ProjectDetailModal({ project, onClose, maxWidth }) {
  const { isEditing, openEdit, closeEdit, handleDelete } = useProjectActions(project);

  if (!project) return null;

  return (
    <>
      <Modal onClose={onClose} maxWidth={maxWidth}>
        <ProjectDetail project={project} onClose={onClose} onEdit={openEdit} onDelete={handleDelete} />
      </Modal>
      <ProjectFormModal open={isEditing} onClose={closeEdit} initialData={project} mode="edit" />
    </>
  );
}