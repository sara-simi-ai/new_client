import React from "react";
import ProjectFinanceLayout from "../ProjectFinanceLayout/ProjectFinanceLayout";
import ProjectActionButtons from "../ProjectActionButtons/ProjectActionButtons";
import { buildProjectMetaRows, ProjectMetaSection } from "../ProjectMetaSection/ProjectMetaSection";
import { isRealText } from "../../../utils/textHelpers";
import "./ProjectDetail.css";
import { useProjects } from "../../../services/context/ProjectsContext";
import StatusGap from "../StatusGap/StatusGap";

export default function ProjectDetail({ project, onClose, onEdit, onDelete }) {
  const { projectFinanceMap } = useProjects();

  if (!project) return null;

  const financeData = projectFinanceMap[project.id];
  const metaRows = buildProjectMetaRows(project);
  const projectDescription = isRealText(project.teur) ? project.teur : "";
  const hearot = isRealText(project.hearot) ? project.hearot : "";
  const gapStatus = financeData?.statusPearim || "takin";

  return (
    <div className="det" dir="rtl">
      <header className="det-head">
        <div className="det-title-wrap">
          <div className="det-title-row">
            <h3 className="det-name">{project.projectName}</h3>
            <StatusGap status={gapStatus} className="det-status-badge" />
          </div>
          <ProjectMetaSection rows={metaRows} />
        </div>

        <div className="det-actions">
          <div className="det-actions-stack">
            {onClose && <button className="det-btn-close" onClick={onClose} aria-label="סגור">✕</button>}
            <ProjectActionButtons onEdit={onEdit} onDelete={onDelete} className="det-actions-group" />
          </div>
        </div>
      </header>

      <div className="det-body">
        <div className="det-lbl">נתוני תקציב</div>
        <ProjectFinanceLayout
          financeData={financeData}
          mode="detail"
        />

        {projectDescription && (
          <>
            <div className="det-lbl">תיאור הפרויקט</div>
            <div className="det-desc">{projectDescription}</div>
          </>
        )}

        <>
          <div className="det-lbl">הערות</div>
          <div className="det-desc">{hearot}</div>
        </>
      </div>
    </div>
  );
}