import { useCallback, useEffect, useMemo } from 'react';
import { useProjects } from '../../../services/context/ProjectsContext';
import { useManagementListAsync } from './useManagementListAsync';
import { DUPLICATE_NAME_ERROR } from '../../../utils/Dec';

export function useProjectsManagement() {
  const {
    isLoading: contextLoading,
    addNewProject,
    updateProjectData,
    toggleProjectStatus,
    allProjects,
    loadAllProjects,
  } = useProjects();

  // Load all projects on mount if not already loaded
  useEffect(() => {
    if (!allProjects?.length) {
      loadAllProjects().catch(() => {});
    }
  }, []);

  // Normalize projects to have a 'name' field for useManagementListAsync
  // (consistent with how AgaffContext normalizes data)
  const normalizedProjects = useMemo(() => {
    return (allProjects || []).map((project) => ({
      ...project,
      name: project.projectName || project.teur || '—',
    }));
  }, [allProjects]);

  const getItems = useCallback(() => normalizedProjects, [normalizedProjects]);
  
  const createItem = useCallback((name) => {
    return addNewProject({
      projectName: name,
      teur: name,
    });
  }, [addNewProject]);
  
  const updateItem = useCallback((id, payload) => {
    return updateProjectData({
      id,
      projectName: payload.name,
      teur: payload.name,
    });
  }, [updateProjectData]);
  
  const itemToOption = useCallback(
    (project) => ({
      value: project.id,
      label: project.name || '—',
      active: project.active !== false,
    }),
    [],
  );

  const hook = useManagementListAsync({
    getItems,
    createItem,
    updateItem,
    toggleActive: toggleProjectStatus,
    itemToOption,
    duplicateErrorMessage: DUPLICATE_NAME_ERROR,
  });

  return {
    ...hook,
    isLoading: hook.isLoading || contextLoading,
  };
}
