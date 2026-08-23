import React from "react";
import "./StatusGap.css";

export const GAP_STATUS_META = {
  odef: {
    label: "עודף",
    className: "status-gap--odef",
    accentClass: "card-accent--odef",
  },
  geraon: {
    label: "גרעון",
    className: "status-gap--geraon",
    accentClass: "card-accent--geraon",
  },
  takin: {
    label: "תקין",
    className: "status-gap--takin",
    accentClass: "card-accent--takin",
  },
};

export function getGapStatusMeta(status = "takin") {
  return GAP_STATUS_META[status] || GAP_STATUS_META.takin;
}

export default function StatusGap({ status = "takin", className = "" }) {
  const meta = getGapStatusMeta(status);

  return (
    <span className={`status-gap ${meta.className} ${className}`.trim()}>
      {meta.label}
    </span>
  );
}
