import React from "react";
import { useProjects } from "../../../services/context/ProjectsContext";
import ProjectFinanceLayout from "../ProjectFinanceLayout/ProjectFinanceLayout";
import { buildProjectMetaRows, ProjectMetaSection } from "../ProjectMetaSection/ProjectMetaSection";
import { isRealText } from "../../../utils/textHelpers";
import "../ProjectsList/Project.css";
import "./ProjectCard.css";
import ProjectFormModal from "../ProjectFormModal/ProjectFormModal";
import { useProjectActions } from "../hooks/useProjectActions";
import StatusGap, { getGapStatusMeta } from "../StatusGap/StatusGap";
import { getProjectGapStatus } from "../../../utils/calculateProjectFinanceHelper";

export default function ProjectCard({ project }) {
  const { projectFinanceMap, selectedProjectId, setSelectedProjectId } = useProjects();
  const { isEditing, openEdit, closeEdit, handleDelete } = useProjectActions(project);

  const financeData = projectFinanceMap[project.id];
  const isSelected = selectedProjectId === project.id;
  const onSelect = () => setSelectedProjectId(isSelected ? null : project.id);

  const description = isRealText(project.teur) ? project.teur : "";
  const gapStatus = getProjectGapStatus(financeData, project);
  const statusMeta = getGapStatusMeta(gapStatus);
  const metaRows = buildProjectMetaRows(project);

  const handleCardClick = (event) => {
    const clickedInteractiveElement = event.target.closest("button, a, input, select, textarea");
    if (clickedInteractiveElement) {
      return;
    }
    onSelect();
  };

  return (
    <div className={`card ${isSelected ? "sel" : ""}`} onClick={handleCardClick}>
      <div className={`card-accent ${statusMeta.accentClass}`} />
      <StatusGap status={gapStatus} className="card-status-badge" />
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
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>
      <ProjectFormModal open={isEditing} onClose={closeEdit} initialData={project} mode="edit" />
    </div>
  );
}