import React, { useState } from "react";
import { useProjects } from "../../../services/context/ProjectsContext";
import ProjectFinanceLayout from "../ProjectFinanceLayout/ProjectFinanceLayout";
import { buildProjectMetaRows, ProjectMetaSection } from "../ProjectMetaSection/ProjectMetaSection";
import { isRealText } from "../../../utils/textHelpers";
import "../ProjectsList/Project.css";
import "./ProjectCard.css";
import ProjectFormModal from "../ProjectFormModal/ProjectFormModal";

export default function ProjectCard({ project }) {
  const { deleteProjectData, projectFinanceMap, selectedProjectId, setSelectedProjectId } = useProjects();

  const financeData = projectFinanceMap[project.id];
  const isSelected = selectedProjectId === project.id;
  const onSelect = () => setSelectedProjectId(isSelected ? null : project.id);
  const [openEdit, setOpenEdit] = useState(false);

  const description = isRealText(project.teur) ? project.teur : "";
  const gapStatus = financeData?.statusPearim || "takin";
  const gapClass = gapStatus === 'odef'
    ? 'card-accent--odef'
    : gapStatus === 'geraon'
      ? 'card-accent--geraon'
      : 'card-accent--takin';

  const statusLabels = {
    odef: 'עודף',
    geraon: 'גרעון',
    takin: 'תקין',
  };
  const statusLabel = statusLabels[gapStatus] || statusLabels.takin;

  const metaRows = buildProjectMetaRows(project);

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
      <span className={`status-badge status-badge--${gapStatus}`}>{statusLabel}</span>
      <div className="card-body">
        <div className="card-title-row">
          <div className="card-name">{project.projectName}</div>
        </div>
        
        <ProjectMetaSection rows={metaRows} />

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