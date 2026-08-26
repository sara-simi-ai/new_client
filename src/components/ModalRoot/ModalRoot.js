import React from 'react';
import { useProjects } from '../../services/context/ProjectsContext';
import ProjectDetailModal from '../../features/projects/ProjectDetail/ProjectDetailModal';

export default function ModalRoot() {
  const { selectedProject, setSelectedProjectId } = useProjects();
  if (!selectedProject) return null;
  return <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProjectId(null)} />;
}
