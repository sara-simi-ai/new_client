import { useState } from 'react';

export function useProjectDetail(projects) {
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const selectedProject = projects?.find((p) => p.id === selectedProjectId) || null;

  const openProjectDetail = (id) => {
    setSelectedProjectId(id);
  };

  const closeProjectDetail = () => {
    setSelectedProjectId(null);
  };

  return {
    selectedProjectId,
    selectedProject,
    openProjectDetail,
    closeProjectDetail,
  };
}
