import React from "react";
import "./StatusGap.css";

export const GAP_STATUS_META = {
  odef: {
    label: "עודף",
    className: "status-gap--odef",
    accentClass: "card-accent--odef",
    tooltip: "",
  },
  geraon: {
    label: "גרעון",
    className: "status-gap--geraon",
    accentClass: "card-accent--geraon",
    tooltip: "",
  },
  takin: {
    label: "תקין",
    className: "status-gap--takin",
    accentClass: "card-accent--takin",
    tooltip: "",
  },
  missing_planning: {
    label: "!",
    className: "status-gap--missing-planning",
    accentClass: "card-accent--missing-planning",
    tooltip: "עדיין לא הוכנס תכנון כ\"א",
  },
};

export function getGapStatusMeta(status = "takin") {
  return GAP_STATUS_META[status] || GAP_STATUS_META.takin;
}

export default function StatusGap({ status = "takin", className = "" }) {
  const meta = getGapStatusMeta(status);

  return (
    <span
      className={`status-gap ${meta.className} ${className}`.trim()}
      title={meta.tooltip || undefined}
      aria-label={meta.tooltip || meta.label}
    >
      {meta.label}
    </span>
  );
}
