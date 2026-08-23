import React from "react";
import {
  MASLOL_OPTIONS,
  CONTINUATION_TRUE_LABEL,
  CONTINUATION_FALSE_LABEL,
  CONTINUATION_LABEL,
  AGAF_LABEL,
  MASLOL_LABEL,
  MACHLAKA_LABEL,
  CHATIVA_LABEL,
} from "../../../utils/Dec";
import { getOptionLabelByValue } from "../../../utils/optionHelpers";
import "./ProjectMetaSection.css";

function getContinuationLabel(isHemshechi) {
  const isContinuation = Boolean(isHemshechi);
  return isContinuation ? CONTINUATION_TRUE_LABEL : CONTINUATION_FALSE_LABEL;
}

function buildMetaItem(label, value) {
  return { label: `${label}:`, value };
}

function getProjectValue(project, fallbackKeys) {
  const value = fallbackKeys
    .map((key) => project?.[key])
    .find((entry) => entry !== undefined && entry !== null && entry !== "");

  return value ?? "";
}

export function buildProjectMetaRows(project) {
  const agaffValue = getProjectValue(project, ["agaffName", "AgaffName", "agaff"]);
  const machlakaValue = getProjectValue(project, ["machlakaName", "MachlakaName", "machlaka"]);
  const chativaValue = getProjectValue(project, ["chativaName", "ChativaName", "chativa"]);

  return [
    [
      buildMetaItem(AGAF_LABEL, agaffValue),
      buildMetaItem(CHATIVA_LABEL, chativaValue),
      buildMetaItem(MACHLAKA_LABEL, machlakaValue),     
    ],
    [
      buildMetaItem(CONTINUATION_LABEL, getContinuationLabel(project?.logHemsheci)),
      buildMetaItem(MASLOL_LABEL, getOptionLabelByValue(MASLOL_OPTIONS, project?.maslol)),
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