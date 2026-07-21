import React from "react";
import { MASLOL_OPTIONS, CONTINUATION_TRUE_LABEL, CONTINUATION_FALSE_LABEL, CONTINUATION_LABEL, AGAF_LABEL, MASLOL_LABEL, TSEVET_LABEL } from "../../../utils/Dec";
import { getOptionLabelByValue } from "../../../utils/optionHelpers";
import "./ProjectMetaSection.css";

function getContinuationLabel(isHemshechi) {
  const isContinuation = Boolean(isHemshechi);
  return `${isContinuation ? CONTINUATION_TRUE_LABEL : CONTINUATION_FALSE_LABEL}`;
}

export function buildProjectMetaRows(project) {  
  
  return [
    [
      { label: `${AGAF_LABEL}:`, value: project.agaffName },
      { label: `${TSEVET_LABEL}:`, value: project.tsevetMevatseaName },
    ],
    [
      { label: `${CONTINUATION_LABEL}:`, value: getContinuationLabel(project.logHemsheci) },
      { label: `${MASLOL_LABEL}:`, value: getOptionLabelByValue(MASLOL_OPTIONS, project.maslol) },
    ],
  ];
}

export function ProjectMetaSection({ rows }) {
  return (
    <div className="project-meta-section">
      {rows.map((row, rowIndex) => (
        <div className="project-meta-row" key={rowIndex}>
          {row.map((item, itemIndex) => (
            <div key={`${rowIndex}-${itemIndex}`} className="project-meta-item">
              <span className="project-meta-label">{item.label}</span>
              <span className="project-meta-value">{item.value || "—"}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default { buildProjectMetaRows, ProjectMetaSection };