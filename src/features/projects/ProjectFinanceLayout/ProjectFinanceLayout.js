import React from "react";
import { formatMoney } from "../../../utils/formatMoneyHelper";
import { formatPlannedHrValue } from "../../../utils/calculateProjectFinanceHelper";
import { GapElement } from "../../../components/GapElement/GapElement";
import { HR_BUDGET_LABEL, PROCUREMENT_BUDGET_LABEL, PLANNED_HR_LABEL, GAPS_LABEL, TOTAL_BUDGET_LABEL } from "../../../utils/Dec";
import ProjectActionButtons from "../ProjectActionButtons/ProjectActionButtons";
import "./ProjectFinanceLayout.css";

export default function ProjectFinanceLayout({ financeData, mode = "card", onEdit, onDelete, showActions = false }) {
  const { totalTakzivCoachAdam = 0, totalTakzivRechesh = 0, coachAdam = 0, totalTaktziv = 0 } = financeData || {};

  const isCardMode = mode === "card";
  const shouldRenderActions = Boolean(onEdit || onDelete) && (isCardMode || showActions);
  const classNames = isCardMode
    ? { container: "cf", label: "cf-lbl", value: "cf-val" }
    : { container: "pd-fc", label: "pd-fc-lbl", value: "pd-fc-val" };

  const baseFields = [
    { label: HR_BUDGET_LABEL, value: totalTakzivCoachAdam },
    { label: PROCUREMENT_BUDGET_LABEL, value: totalTakzivRechesh },
    { label: PLANNED_HR_LABEL, value: coachAdam, renderValue: () => formatPlannedHrValue(coachAdam) },
    {
      label: GAPS_LABEL,
      renderValue: () => <GapElement financeData={financeData} showMissingPlanningPlaceholder={true} />,
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

      {shouldRenderActions && (
        <div className={isCardMode ? "cf-tot-row" : "cf-tot-row cf-tot-row--detail"}>
          {isCardMode && <div className="cf-tot">סה"כ {formatMoney(totalTaktziv)}</div>}
          {!isCardMode && <div className="cf-tot" aria-hidden="true" />}
          <ProjectActionButtons onEdit={onEdit} onDelete={onDelete} />
        </div>
      )}
    </div>
  );
}