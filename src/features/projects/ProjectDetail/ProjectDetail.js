
import React from "react";
import ProjectFinanceLayout from "../ProjectFinanceLayout/ProjectFinanceLayout";
import { MaslolElement, HemsheciElement } from "../ProjectElements/ProjectElements";
import "./ProjectDetail.css";
import { useProjects } from "../../../services/context/ProjectsContext";

export default function ProjectDetail({ project, onClose, onEdit }) {
  
  const { projectFinanceMap } = useProjects();

  if (!project) return null;

  const financeData = projectFinanceMap[project.id];

  return (
    <div className="det" dir="rtl">
      <header className="det-head">
        <div>
          <h3 className="det-name">{project.projectName}</h3>
          <div className="det-badges">
            <MaslolElement maslol={project.maslol} />
            {project.yechidaMevatzat && <span className="badge b-unit">{project.yechidaMevatzat}</span>}
            {project.agaff           && <span className="badge b-sector">{project.agaff}</span>}
            {project.logHemsheci !== undefined && (
              <HemsheciElement isHemshechi={project.logHemsheci} />
            )}
          </div>
        </div>

        <div className="det-actions">
          {onEdit && <button className="det-btn-edit" onClick={() => onEdit(project)}>עדכון פרויקט</button>}
          {onClose && <button className="det-btn-close" onClick={onClose} aria-label="סגור">✕</button>}
        </div>
      </header>

      <div className="det-body">
        {project.teur && (
          <>
            <div className="det-lbl">תיאור הפרויקט</div>
            <div className="det-desc">{project.teur}</div>
          </>
        )}

        <div className="det-lbl">נתוני תקציב</div>
        <ProjectFinanceLayout financeData={financeData} mode="detail" />

        {project.remarks && (
          <>
            <div className="det-lbl">הערות</div>
            <div className="det-desc det-desc--short">{project.remarks}</div>
          </>
        )}
      </div>
    </div>
  );
}