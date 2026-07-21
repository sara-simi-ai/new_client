import React from "react";
import ProjectFinanceLayout from "../ProjectFinanceLayout/ProjectFinanceLayout";
import { buildProjectMetaRows, ProjectMetaSection } from "../ProjectMetaSection/ProjectMetaSection";
import { isRealText } from "../../../utils/textHelpers";
import "./ProjectDetail.css";
import { useProjects } from "../../../services/context/ProjectsContext";

export default function ProjectDetail({ project, onClose, onEdit }) {

  const { projectFinanceMap } = useProjects();

  if (!project) return null;

  const financeData = projectFinanceMap[project.id];
  const metaRows = buildProjectMetaRows(project);
  const projectDescription = isRealText(project.teur) ? project.teur : "";
  const hearot = isRealText(project.hearot) ? project.hearot : "";

  return (
    <div className="det" dir="rtl">
      <header className="det-head">
        <div>
          <h3 className="det-name">{project.projectName}</h3>
          <ProjectMetaSection rows={metaRows} />
        </div>

        <div className="det-actions">
          {onEdit && <button className="det-btn-edit" onClick={() => onEdit(project)}>עדכון פרויקט</button>}
          {onClose && <button className="det-btn-close" onClick={onClose} aria-label="סגור">✕</button>}
        </div>
      </header>

      <div className="det-body">
        <div className="det-lbl">נתוני תקציב</div>
        <ProjectFinanceLayout financeData={financeData} mode="detail" />

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