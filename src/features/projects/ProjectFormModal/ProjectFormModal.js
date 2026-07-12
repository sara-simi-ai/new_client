import React from "react";
import "./ProjectFormModal.css";
import ProjectForm from "./ProjectForm";
import { useProjects } from "../../../services/context/ProjectsContext";

export default function ProjectFormModal({ open, onClose, initialData = {}, mode = "new" }) {
  const { updateProjectData, addNewProject } = useProjects();
  if (!open) return null;

  const handleSubmit = async (data) => {
    if (mode === "edit") {
      await updateProjectData({ ...data, id: initialData.id });
    } else {
      await addNewProject(data);
    }
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="pfm-backdrop" dir="rtl" onClick={handleBackdropClick}>
      <div className="pfm-modal" onClick={(e) => e.stopPropagation()}>
        <header className="pfm-header">
          <h3>{mode === "edit" ? "עדכון פרויקט" : "פרויקט חדש"}</h3>
          <button onClick={onClose} aria-label="close">✕</button>
        </header>
        <div className="pfm-body">
          <ProjectForm initialData={initialData} mode={mode} onSubmit={handleSubmit} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
}
