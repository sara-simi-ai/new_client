// src/components/ProjectsList/Project/ProjectCard.js
import React from "react";
import { useProjects } from "../../../../services/context/ProjectsContext";
import { MaslolElement, HemsheciElement, isKiyumMaslol } from "../../ProjectElements/ProjectElements";
import ProjectFinanceLayout from "../../../ProjectFinanceLayout/ProjectFinanceLayout";
import "../Project.css";
import "./ProjectCard.css";
import { useState } from "react";
import ProjectFormModal from "../../ProjectFormModal/ProjectFormModal";

export default function ProjectCard({ project }) {
  const { deleteProjectData, projectFinanceMap, selectedProjectId, setSelectedProjectId } = useProjects();

  const financeData = projectFinanceMap[project.id];
  const isSelected = selectedProjectId === project.id;
  const onSelect = () => setSelectedProjectId(isSelected ? null : project.id);

  const isKiyum = isKiyumMaslol(project.maslol);
  const [openEdit, setOpenEdit] = useState(false);

  const handleCardClick = (event) => {
    const clickedInteractiveElement = event.target.closest("button, a, input, select, textarea");
    if (clickedInteractiveElement) {
      return;
    }
    onSelect();
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("למחוק את הפרויקט?")) return;

    try {
      await deleteProjectData(project.id);
    } catch (err) {
      console.error("שגיאה במחיקת פרויקט:", err);
    }
  };

  return (
    <div className={`card ${isSelected ? "sel" : ""}`} onClick={handleCardClick}>
      <div className={`card-accent ${isKiyum ? "card-accent--kiyum" : "card-accent--hit"}`} />
      <div className="card-body">
        <div className="card-title-row">
          <div className="card-name">{project.projectName}</div>
          <div className="card-actions">
            <MaslolElement maslol={project.maslol} />
          </div>
        </div>
        <div className="card-meta">
          <span className="badge b-sector">אגף {project.agaff}</span>
          <span className="card-unit">{project.yechidaMevatzat}</span>
          <HemsheciElement isHemshechi={project.logHemsheci} />
        </div>

        <div className={`card-desc ${!project.teur ? "card-desc--empty" : ""}`}>{project.teur || "אין תאור"}</div>

        <ProjectFinanceLayout
          financeData={financeData}
          mode="card"
          onEdit={(e) => { e.stopPropagation(); setOpenEdit(true); }}
          onDelete={handleDelete}
        />
      </div>
      <ProjectFormModal open={openEdit} onClose={() => setOpenEdit(false)} initialData={project} mode="edit" />
    </div>
  );
}