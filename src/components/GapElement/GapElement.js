import React from "react";
import { formatGapDisplay, hasMissingPlannedHrValue } from "../../utils/calculateProjectFinanceHelper";
import { GAP_STATUS_BY_VALUE } from "../../utils/Dec";
// import "../../features/projects/ProjectElements/ProjectElements.css";

export const GapElement = ({ financeData = {}, className = "", showMissingPlanningPlaceholder = true }) => {
  const {
    pearim = 0,
    statusPearim = "takin",
    totalTakzivCoachAdam = 0,
    coachAdam = 0,
  } = financeData || {};

  const isMissingPlanning = showMissingPlanningPlaceholder && hasMissingPlannedHrValue(coachAdam);
  const statusClassName = isMissingPlanning ? "pc-gap--missing-planning" : GAP_STATUS_BY_VALUE[statusPearim]?.className || "";

  return (
    <span className={`pc-gap ${statusClassName} ${className}`.trim()}>
      {formatGapDisplay(pearim, totalTakzivCoachAdam, {
        plannedValue: coachAdam,
        showMissingPlanningPlaceholder,
      })}
    </span>
  );
};

export default GapElement;
