// src/components/ProjectsList/Project/ProjectCard.js
import React from "react";
import { useProjects } from "../../../services/context/ProjectsContext";
import { MaslolElement, HemsheciElement, isKiyumMaslol } from "../ProjectElements/ProjectElements";
import { MASLOL_OPTIONS, CONTINUATION_TRUE_LABEL, CONTINUATION_FALSE_LABEL, CONTINUATION_LABEL } from "../../../utils/Dec";
import ProjectFinanceLayout from "../ProjectFinanceLayout/ProjectFinanceLayout";
import "../ProjectsList/Project.css";
import "./ProjectCard.css";
import { useState } from "react";
import ProjectFormModal from "../ProjectFormModal/ProjectFormModal";

export default function ProjectCard({ project }) {
  const { deleteProjectData, projectFinanceMap, selectedProjectId, setSelectedProjectId } = useProjects();

  const financeData = projectFinanceMap[project.id];
  const isSelected = selectedProjectId === project.id;
  const onSelect = () => setSelectedProjectId(isSelected ? null : project.id);

  const isKiyum = isKiyumMaslol(project.maslol);
  const [openEdit, setOpenEdit] = useState(false);
  
  const isRealText = (value) => {
    const normalized = String(value || "").trim().toLowerCase();
    return normalized !== "" && normalized !== "string";
  };
  
  const maslolLabel = MASLOL_OPTIONS.find((o) => o.value === project.maslol)?.label || "לא ידוע";
  const hemsheechiText = project.logHemsheci ? CONTINUATION_TRUE_LABEL : CONTINUATION_FALSE_LABEL;
  const description = isRealText(project.teur) ? project.teur : "";
  const gapStatus = financeData?.statusPearim || "takin";
  const gapClass = gapStatus === 'odef'
    ? 'card-accent--odef'
    : gapStatus === 'geraon'
      ? 'card-accent--geraon'
      : 'card-accent--takin';

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
      <div className={`card-accent ${gapClass}`} />
      <div className="card-body">
        <div className="card-title-row">
          <div className="card-name">{project.projectName}</div>
        </div>
        
        <div className="card-meta-section">
          <div className="card-meta-row">
            <span className="card-meta-label">אגף:</span>
            <span className="card-meta-value">{project.agaff}</span>
            <span className="card-meta-label">מבוצע ע"י:</span>
            <span className="card-meta-value">{project.yechidaMevatzat}</span>
          </div>
          
          <div className="card-meta-row">
            <span className="card-meta-label">המשכי:</span>
            <span className="card-meta-value">{hemsheechiText}</span>
            <span className="card-meta-label">מסלול:</span>
            <span className="card-meta-value">{maslolLabel}</span>
          </div>
        </div>

        <div className={`card-desc ${!description ? "card-desc--empty" : ""}`}>
          <div className="card-desc-label">תיאור:</div>
          <div className="card-desc-text">{description || "אין תאור"}</div>
        </div>

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