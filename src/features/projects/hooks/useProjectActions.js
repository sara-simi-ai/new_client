import { useCallback, useState } from "react";
import { useProjects } from "../../../services/context/ProjectsContext";

export function useProjectActions(project) {
  const { deleteProjectData } = useProjects();
  const [isEditing, setIsEditing] = useState(false);

  const openEdit = useCallback((event) => {
    event?.stopPropagation?.();
    setIsEditing(true);
  }, []);

  const closeEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleDelete = useCallback(async (event) => {
    event?.stopPropagation?.();

    if (!project?.id || !window.confirm("למחוק את הפרויקט?")) {
      return;
    }

    try {
      await deleteProjectData(project.id);
    } catch (err) {
      console.error("שגיאה במחיקת פרויקט:", err);
    }
  }, [deleteProjectData, project?.id]);

  return {
    isEditing,
    openEdit,
    closeEdit,
    handleDelete,
  };
}
