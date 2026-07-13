import React from "react";
import { formatMoney } from "../../../utils/formatMoney";
import { GapElement } from "../../../components/GapElement/GapElement";
import { HR_BUDGET_LABEL, PROCUREMENT_BUDGET_LABEL, PLANNED_HR_LABEL, GAPS_LABEL, TOTAL_BUDGET_LABEL } from "../../../dec/Dec";
import "./ProjectFinanceLayout.css";

export default function ProjectFinanceLayout({ financeData, mode = "card", onEdit, onDelete }) {
  const { totalTakzivCoachAdam = 0, totalTakzivRechesh = 0, coachAdam = 0, totalTaktziv = 0 } = financeData || {};

  const isCardMode = mode === "card";
  const classNames = isCardMode
    ? { container: "cf", label: "cf-lbl", value: "cf-val" }
    : { container: "pd-fc", label: "pd-fc-lbl", value: "pd-fc-val" };

  const baseFields = [
    { label: HR_BUDGET_LABEL, value: totalTakzivCoachAdam },
    { label: PROCUREMENT_BUDGET_LABEL, value: totalTakzivRechesh },
    { label: PLANNED_HR_LABEL, value: coachAdam },
    {
      label: GAPS_LABEL,
      renderValue: () => <GapElement financeData={financeData} />,
    },
  ];

  const fields = isCardMode
    ? baseFields
    : [
        baseFields[0],
        baseFields[1],
        { label: TOTAL_BUDGET_LABEL, value: totalTaktziv },
        baseFields[2],
        baseFields[3],
      ];

  return (
    <div className={isCardMode ? "card-fin" : "pd-fin-grid"}>
      {fields.map((field) => (
        <div key={field.label} className={classNames.container}>
          <div className={classNames.label}>{field.label}</div>
          <div className={classNames.value}>
            {field.renderValue ? field.renderValue() : formatMoney(field.value)}
          </div>
        </div>
      ))}

      {isCardMode && (
        <div className="cf-tot-row">
          <div className="cf-tot">סה"כ {formatMoney(totalTaktziv)}</div>
          <div className="cf-actions">
            {onDelete && (
              <button className="cf-delete-btn" onClick={onDelete} aria-label="מחק" title="מחק">
                <span> 🗑️ </span>
              </button>
            )}
            {onEdit && (
              <button className="cf-edit-btn" onClick={onEdit} aria-label="עדכן" title="עדכן">
                <span className="cf-edit-icon">✏</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}